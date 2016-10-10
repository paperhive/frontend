import * as angular from 'angular';
import { filter, find, get, last, merge, reverse, sortBy } from 'lodash';

import template from './document-text.html';

class DocumentTextCtrl {
  // input
  revision: any;
  access: boolean;
  latestAccessibleRevision: any;
  discussions: Array<any>;

  draftSelectors: any;
  highlights: Array<any>;
  hoveredHighlights: any;
  hoveredMarginDiscussions: any;
  pageCoordinates: any;
  anchor: string;

  static $inject = ['$animate', '$element', '$http', '$location', '$routeSegment', '$scope', '$window', 'config',
    'notificationService', 'tourService'];
  constructor($animate, $element, public $http, public $location, public $routeSegment,
      public $scope, $window, public config, public notificationService,
      public tourService) {
    this.hoveredHighlights = {};
    this.hoveredMarginDiscussions = {draft: true};
    this.pageCoordinates = {};

    $scope.$watchGroup(['$ctrl.revision', '$ctrl.access'], this.updatePdfUrl.bind(this));

    // update highlights when discussions or draft selectors change
    $scope.$watchCollection('$ctrl.discussions', this.updateHighlights.bind(this));
    $scope.$watch('$ctrl.draftSelectors', this.updateHighlights.bind(this));

    // update and watch anchor and query parameter
    this.updateAnchorFromUrl();
    $scope.$on('$routeUpdate', () => this.updateAnchorFromUrl());
    $scope.$watch('$ctrl.anchor', anchor => this.updateAnchorToUrl(anchor));

    // trigger resize event when animation of .ph-document-text finishes
    function triggerResize(element, phase) {
      if (!element.hasClass('ph-document-text') || phase !== 'close') return;
      angular.element($window).triggerHandler('resize');
    }
    $animate.on('addClass', $element, triggerResize);
    $animate.on('removeClass', $element, triggerResize);
  }

  // create link for pdf destinations
  getLinkDest(dest) {
    const segmentName = this.$routeSegment.name;
    const baseUrl = this.$routeSegment
      .getSegmentUrl(segmentName, this.$routeSegment.$routeParams);
    return `.${baseUrl}?a=pdfd:${encodeURIComponent(dest)}`;
  }

  getNewDiscussion(discussion) {
    return merge(
      {},
      discussion,
      {
        target: {
          document: this.revision.id,
          documentRevision: this.revision.revision,
        }
      }
    );
  }

  updatePdfUrl() {
    if (!this.revision || !this.access) {
      this.pdfUrl = undefined;
      return;
    }

    // if the file available via HTTPS with enabled CORS then just use it
    if (/^https/.test(this.revision.file.url) && this.revision.file.hasCors) {
      this.pdfUrl = this.revision.file;
      return;
    }

    // No HTTPS/Cors? PaperHive can proxy the document if it's open access.
    if (this.revision.isOpenAccess) {
      const encodedUrl = encodeURIComponent(this.revision.file.url);
      this.pdfUrl = `${this.config.apiUrl}/proxy?url=${encodedUrl}`;
    }
  }

  // note: a query parameter is used because a fragment identifier (hash)
  //       is *not* part of the URL.
  updateAnchorFromUrl() {
    // get anchor from hash or search param
    const anchor = this.$location.hash() || this.$location.search().a;
    // reset hash
    this.$location.hash('');
    // update anchor
    this.anchor = anchor;
  }

  updateAnchorToUrl(anchor) {
    this.$location.search({a: anchor});
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
      revision: '<',
      access: '<',
      latestAccessibleRevision: '<',
      discussions: '<',
      viewportOffsetTop: '<',
      expanded: '<',

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
