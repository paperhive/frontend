import * as angular from 'angular';
import { filter, find, merge, sortBy } from 'lodash';
import { parse as urlParse } from 'url';

import template from './document-text.html!text';

class DocumentTextCtrl {
  // input
  revisions: Array<any>;
  discussions: Array<any>;

  // internal
  activeRevision: any;

  draftSelectors: any;
  highlights: Array<any>;
  hoveredHighlights: any;
  hoveredMarginDiscussions: any;
  pageCoordinates: any;



  static $inject = ['$routeSegment', '$scope', 'config', 'notificationService',
    'tourService'];
  constructor(public $routeSegment, public $scope, public config,
      public notificationService, public tourService)
  {
    this.hoveredHighlights = {};
    this.hoveredMarginDiscussions = {};
    this.pageCoordinates = {};

    // update active revision
    $scope.$watch('$ctrl.revisions', this.updateActiveRevision.bind(this));

    // update highlights when discussions or draft selectors change
    $scope.$watch('$ctrl.discussions', this.updateHighlights.bind(this), true);
    $scope.$watch('$ctrl.draftSelectors', this.updateHighlights.bind(this), true);
  }

  getAccessiblePdfUrl(documentRevision) {
    // TODO actually check user access here (e.g., via the Elsevier Article
    // Entitlement API)
    const userHasAccess = documentRevision.isOpenAccess;
    if (!userHasAccess) {
      this.notificationService.notifications.push({
        type: 'error',
        message: 'You currently have no access to the PDF.',
      });
      return undefined;
    }
    if (documentRevision.file.hasCors &&
        urlParse(documentRevision.file.url).protocol === 'https') {
      // all good
      return documentRevision.file;
    }
    // No HTTPS/Cors? PaperHive can proxy the document if it's open access.
    if (documentRevision.isOpenAccess) {
      return this.config.apiUrl + '/proxy?url=' +
        encodeURIComponent(documentRevision.file.url);
    }
    this.notificationService.notifications.push({
      type: 'error',
      message: 'The publisher makes the PDF available only through an insecure connection.'
    });
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

  updateActiveRevision(revisions) {
    if (!revisions) return;

    const revisionId = this.$routeSegment.$routeParams.revisionId;
    if (revisionId) {
      this.activeRevision = find(revisions, {revision: revisionId});
      if (!this.activeRevision) {
        this.notificationService.notifications.push({
          type: 'error',
          message: `Unknown revision ID ${revisionId}.`
        });
      }
      return;
    }

    const openAccessRevisions = filter(revisions, {openAccess: true});
    if (openAccessRevisions.length > 0) {
      // use latest open access version if there is one
      this.activeRevision = sortBy(openAccessRevisions, 'publishedAt', 'desc')[0];
    } else {
      // show latest version if no open access version is found
      this.activeRevision = sortBy(revisions, 'publishedAt', 'desc')[0];
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
