import * as angular from 'angular';
import { filter, find, get, last, merge, reverse, sortBy } from 'lodash';
import { parse as urlParse } from 'url';

import template from './document-text.html';

class DocumentTextCtrl {
  // input
  revisions: Array<any>;
  discussions: Array<any>;

  // internal
  activeRevision: any;
  revisionAccess: any;

  draftSelectors: any;
  highlights: Array<any>;
  hoveredHighlights: any;
  hoveredMarginDiscussions: any;
  pageCoordinates: any;
  anchor: string;

  static $inject = ['$http', '$location', '$routeSegment', '$scope', 'config',
    'notificationService', 'tourService'];
  constructor(public $http, public $location, public $routeSegment,
      public $scope, public config, public notificationService,
      public tourService) {
    this.hoveredHighlights = {};
    this.hoveredMarginDiscussions = {draft: true};
    this.pageCoordinates = {};

    // update active revision
    $scope.$watch('$ctrl.revisions', this.updateActiveRevision.bind(this));

    // update highlights when discussions or draft selectors change
    $scope.$watch('$ctrl.discussions', this.updateHighlights.bind(this), true);
    $scope.$watch('$ctrl.draftSelectors', this.updateHighlights.bind(this), true);

    // update and watch anchor and query parameter
    this.updateAnchor();
    $scope.$on('$routeUpdate', () => this.updateAnchor());
  }

  getAccessiblePdfUrl(revision) {
    if (!this.revisionAccess[revision.revision]) {
      throw new Error('You currently have no access to the PDF.');
    }

    // if the file available via HTTPS with enabled CORS then just use it
    if (/^https/.test(revision.file.url) && revision.file.hasCors) {
      return revision.file;
    }

    // No HTTPS/Cors? PaperHive can proxy the document if it's open access.
    if (revision.isOpenAccess) {
      const encodedUrl = encodeURIComponent(revision.file.url);
      return `${this.config.apiUrl}/proxy?url=${encodedUrl}`;
    }
    throw new Error('The publisher of the PDF has an incomplete server configuration (no HTTPS or no CORS).');
  }

  // create link for pdf destinations
  getLinkDest(dest) {
    const segmentName = this.$routeSegment.name;
    const baseUrl = this.$routeSegment.getSegmentUrl(
      segmentName,
      segmentName === 'documents.text' ?
        {documentId: this.activeRevision.id} :
        {documentId: this.activeRevision.id, revisionId: this.activeRevision.revision}
    );
    return `.${baseUrl}#pdfdest:${encodeURIComponent(dest)}`;
  }

  getNewDiscussion(discussion) {
    return merge(
      {},
      discussion,
      {
        target: {
          document: this.activeRevision.id,
          documentRevision: this.activeRevision.revision,
        }
      }
    );
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

  async isRevisionAccessible(revision) {
    if (revision.isOpenAccess) {
      return true;
    }
    if (revision.remote.type === 'elsevier') {
      const result = await this.$http.get(
        `https://api.elsevier.com/content/article/entitlement/doi/${revision.doi}`,
        {
          params: {
            apiKey: 'd7cd85afb9582a3d0862eb536dac32b0',
            httpAccept: 'application/json',
          }
        }
      );
      if (get(result, 'data.entitlement-response.document-entitlement.entitled')) {
        return true;
      }
    }
    return false;
  }

  async updateActiveRevision(revisions) {
    if (!revisions) return;

    // get accessibility information for all revisions
    this.revisionAccess = {};
    for (const revision of revisions) {
      this.revisionAccess[revision.revision] = await this.isRevisionAccessible(revision);
    }

    // explicitly provided revision id?
    const revisionId = this.$routeSegment.$routeParams.revisionId;
    if (revisionId) {
      this.activeRevision = find(revisions, {revision: revisionId});
      if (!this.activeRevision) {
        this.notificationService.notifications.push({
          type: 'error',
          message: `Unknown revision ID ${revisionId}.`
        });
      }
    } else {
      // order revisions by date: newest first
      const sortedRevisions = reverse(sortBy(revisions, 'publishedAt'));

      // filter accessible revisions
      const accessibleRevisions =
        sortedRevisions.filter(revision => this.revisionAccess[revision.revision]);

      // use latest accessible revision (or latest revision if none are accessible)
      this.activeRevision = accessibleRevisions.length > 0 ?
        accessibleRevisions[0] : sortedRevisions[0];
    }

    // get pdf url
    try {
      this.origPdfUrl = this.activeRevision.file.url;
      this.pdfUrl = this.getAccessiblePdfUrl(this.activeRevision);
    } catch (e) {
      this.notificationService.notifications.push({
        type: 'error',
        message: 'PDF cannot be displayed: ' + e.message
      });
    }
    this.$scope.$apply();
  }

  // note: a query parameter is used because a fragment identifier (hash)
  //       is *not* part of the URL.
  updateAnchor() {
    // transform fragment identifier (hash) into a query parameter
    let hash = this.$location.hash();
    if (hash) {
      this.$location.hash('');
      this.$location.search({a: hash});
    }

    // use query parameter 'a' as anchor
    this.anchor = this.$location.search().a;
  }

  // generate highlights array
  updateHighlights() {
    if (!this.discussions) return;

    const highlights = this.discussions.map(discussion => {
      return {id: discussion.id, selectors: discussion.target.selectors};
    });

    // add draft selectors
    if (this.draftSelectors) {
      highlights.push({id: 'draft', selectors: this.draftSelectors});
    }

    this.highlights = highlights;
  }
}

export default function(app) {
  app.component('documentText', {
    bindings: {
      revisions: '<',
      discussions: '<',
      viewportOffsetTop: '<',

      onDiscussionSubmit: '&',
      onDiscussionUpdate: '&',
      onDiscussionDelete: '&',
      onReplySubmit: '&',
      onReplyUpdate: '&',
      onReplyDelete: '&',
    },
    template,
    controller: DocumentTextCtrl,
  });
}
