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
          const loginPromise = auth.loginPromise || Promise.resolve();
          return loginPromise
            .then(() => $http.get(`${config.apiUrl}/documents/${this.documentId}/revisions`))
            .then(response => this.revisions = response.data.revisions);
        }

        static async isRevisionAccessible(revision) {
          if (revision.isOpenAccess || revision.remote.type === 'qnd') return true;
          try {
            if (revision.remote.type === 'elsevier') {
              return false;
            }

            if (revision.remote.type === 'springer') {
              try {
                const result = await $http.head(revision.file.url);
                if (result.status === 200) {
                  return true;
                }
              } catch (error) {
                return false;
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

          if (revision.remote.type === 'transcript') {
            return revision.publisher;
          }

          if (revision.remote.type === 'oapen') return 'OAPEN';

          if (revision.remote.type === 'langsci') {
            const rev = revision.remote.revision === 'openreview' ?
              'open review' : revision.remote.revision;
            return `LangSci ${rev}`;
          }

          if (revision.remote.type === 'paperhiveGhp') {
            if (revision.documentType === 'lecture-notes') {
              return `Lecture notes`;
            }
            return `PaperHive ${revision.remote.revision}`;
          }

          if (revision.remote.type === 'springer') {
            return revision.publisher;
          }

          if (revision.publisher) {
            return revision.publisher;
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

          if (revision.publisherUrl) return revision.publisherUrl;

          switch (revision.remote.type) {
            case 'arxiv':
              return `https://arxiv.org/abs/${revision.remote.id}${revision.remote.revision}`;
            case 'elsevier':
            case 'springer':
            case 'transcript':
              return `https://dx.doi.org/${revision.remote.id}`;
            case 'langsci':
              return `http://langsci-press.org/catalog/book/${revision.remote.id}`;
            case 'oapen':
              return `https://oapen.org/search?identifier=${revision.remote.id}`;
            case 'paperhiveGhp':
            case 'qnd':
              return undefined;
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

        static async upload(file: File, onProgress: (o: {submittedBytes: number}) => void) {
          return $http.post(
            `${config.apiUrl}/documents`,
            file,
            {
              headers: {
                'Content-Type': file.type,
              },
              params: {
                filename: file.name,
              },
              uploadEventHandlers: {
                progress: e => onProgress && onProgress({submittedBytes: e.loaded}),
              },
            },
          );
        }
      };
    },
  ]);
}
