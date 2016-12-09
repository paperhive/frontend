import { find, get, remove, reverse, sortBy } from 'lodash';
import { parse as urlParse } from 'url';

export default function(app) {
  app.factory('DocumentController', [
    '$http', '$rootScope', '$timeout', 'authService', 'config', 'notificationService',
    ($http, $rootScope, $timeout, auth, config, notificationService) => {
      // controller for one document
      return class DocumentController {
        revisions: any[];
        revisionAccess = {};
        latestRevision: any;
        latestAccessibleRevision: any;
        hivers: any[];
        isUserHiver: boolean;
        bookmarks: any[];

        constructor(public documentId) {
          $rootScope.$watchCollection(() => this.revisions, this.updateRevisionAccess.bind(this));
          $rootScope.$watch(() => auth.user, this.updateIsUserHiver.bind(this));
          $rootScope.$watchCollection(() => this.hivers, this.updateIsUserHiver.bind(this));
        }

        fetchRevisions() {
          return $http
            .get(`${config.apiUrl}/documents/${this.documentId}/revisions`)
            .then(response => this.revisions = response.data.revisions);
        }

        static async isRevisionAccessible(revision) {
          if (revision.isOpenAccess) return true;
          try {
            if (revision.remote.type === 'elsevier') {
              // extract apiKey from file.url
              const parsedUrl = urlParse(revision.file.url, true);
              const apiKey = parsedUrl.query.apiKey;

              const id = revision.pii ? `pii/${revision.pii}` : `doi/${revision.doi}`;

              const result = await $http.get(
                `https://api.elsevier.com/content/article/entitlement/${id}`,
                {params: {apiKey, httpAccept: 'application/json'}},
              );
              if (get(result, 'data.entitlement-response.document-entitlement.entitled')) {
                return true;
              }
            }
          } catch (err) {
            notificationService.notifications.push({
              type: 'error',
              message: `Access check error for revision ${revision.revision}: ` +
                ((err.status && err.statusText) ?
                `request to ${err.config.url} failed (${err.status} ${err.statusText})` :
                err.message),
            });
          }

          return false;
        }

        // Construct strings for display in revision selection dropdown.
        getRevisionDescription(revision) {
          if (!revision) return;

          // prefer short/shortened journal name
          if (revision.journal && revision.journal.nameShort) {
            return revision.journal.nameShort;
          }
          if (revision.journal && revision.journal.nameLong) {
            return revision.journal.nameLong.substring(0, 20);
          }

          // arxiv
          if (revision.remote.type === 'arxiv') {
            // For arXiv, concatenate the remote name and the version
            // without comma.
            return `arXiv ${revision.remote.revision}`;
          }

          if (revision.remote.type === 'oapen') return 'OAPEN';

          if (revision.remote.type === 'langsci') {
            const rev = revision.remote.revision === 'openreview' ?
              'open review' : revision.remote.revision;
            return `LangSci ${rev}`;
          }

          // isbn
          if (revision.isbn) {
            return `ISBN ${revision.isbn}`;
          }

          // fallback: remote with revision or id
          if (revision.remote.revision) {
            return `${revision.remote.type}, ${revision.remote.revision}`;
          }
          return `${revision.remote.type}, ${revision.remote.id}`;
        }

        getRevisionPublisherLink(revision) {
          if (!revision) return;

          switch (revision.remote.type) {
            case 'arxiv':
              return `https://arxiv.org/abs/${revision.remote.id}${revision.remote.revision}`;
            case 'elsevier':
              return `https://dx.doi.org/${revision.remote.id}`;
            case 'langsci':
              return `http://langsci-press.org/catalog/book/${revision.remote.id}`;
            case 'oapen':
              return `https://oapen.org/search?identifier=${revision.remote.id}`;
            default:
              throw new Error('unknown remote type');
          }
        }

        async updateRevisionAccess() {
          if (!this.revisions) return;

          // get accessibility information for all revisions
          const revisionAccess = {};
          for (const revision of this.revisions) {
            revisionAccess[revision.revision] = await DocumentController.isRevisionAccessible(revision);
          }
          this.revisionAccess = revisionAccess;

          // order revisions by date: newest first
          const sortedRevisions = reverse(sortBy(this.revisions, 'publishedAt'));

          // latest revision id (cannot be undefined)
          this.latestRevision = sortedRevisions[0];

          // filter accessible revisions
          const accessibleRevisions =
            sortedRevisions.filter(revision => this.revisionAccess[revision.revision]);

          // latest accessible revision (may be undefined)
          this.latestAccessibleRevision = accessibleRevisions[0];

          $rootScope.$apply();
        }

        fetchHivers() {
          return $http
            .get(`${config.apiUrl}/documents/${this.documentId}/hivers`)
            .then(response => {
              this.hivers = response.data.hivers;
            });
        }

        hive() {
          return $http
            .post(`${config.apiUrl}/documents/${this.documentId}/hive`)
            .then(response => this.hivers.push({
              hivedAt: new Date(),
              person: auth.user,
            }));
        }

        unhive() {
          return $http
            .delete(`${config.apiUrl}/documents/${this.documentId}/hive`)
            .then(response => remove(this.hivers, {person: {id: auth.user.id}}));
        }

        updateIsUserHiver() {
          if (!this.hivers || !auth.user) {
            this.isUserHiver = false;
          } else {
            this.isUserHiver = !!find(this.hivers, {person: {id: auth.user.id}});
          }
        }

        fetchBookmarks() {
          return $http
            .get(`${config.apiUrl}/documents/${this.documentId}/bookmarks`)
            .then(response => {
              this.bookmarks = [];
              response.data.bookmarks.forEach((bookmark) => {
                this.bookmarks.push(bookmark.channel.id);
              });
            });
        }

        bookmark(channel) {
          return $http
            .post(`${config.apiUrl}/documents/${this.documentId}/bookmarks?channel=${channel}`)
            .then(response => this.bookmarks.push(channel));
        }

        removeBookmark(channel) {
          return $http
            .delete(`${config.apiUrl}/documents/${this.documentId}/bookmarks?channel=${channel}`)
            .then(response => {
              const index = this.bookmarks.indexOf(channel);
              if (index > -1) this.bookmarks.splice(index, 1);
            });
        }

      };
    },
  ]);
}
