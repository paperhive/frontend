import jquery from 'jquery';
import { isArray, merge } from 'lodash';
import { SearchIndex } from 'srch';

class DocumentItemTextCtrl {
  // input
  documentItem: any;
  documentItems: any[];
  availableChannels: any;
  discussions: any[];
  filteredDiscussions: any[];
  indexSearchResults: number;

  accessibleItem: any;
  accessibleItemType: string;
  draftSelectors: any;
  highlights: any[];
  hoveredHighlights: any;
  hoveredMarginDiscussions: any;
  pageCoordinates: any;
  anchor: string;
  pdfUrl: string;
  pdfInfo: any;
  pdfText: string;
  searchStr: string;
  searchIndex: SearchIndex;
  searchMatches: IRange[];
  onPdfInfoUpdate: (o: {pdfInfo: any}) => Promise<void>;
  onSearchMatchesUpdate: (o: {searchMatches: any[]}) => void;

  static $inject = ['$animate', '$element', '$http', '$location',
    '$routeSegment', '$scope', '$window', 'authService', 'config',
    'documentUploadModalService', 'featureFlagsService', 'notificationService'];
  constructor($animate, $element, public $http, public $location,
              public $routeSegment, public $scope, $window,
              public authService, public config,
              public documentUploadModalService,
              public featureFlagsService, public notificationService) {
    this.hoveredHighlights = {};
    this.hoveredMarginDiscussions = {draft: true};
    this.pageCoordinates = {};

    $scope.$watch('$ctrl.documentItem', this.updatePdfUrl.bind(this));

    // update highlights when discussions or draft selectors change
    $scope.$watchCollection('$ctrl.filteredDiscussions', this.updateHighlights.bind(this));
    $scope.$watch('$ctrl.draftSelectors', this.updateHighlights.bind(this));

    // update and watch anchor and query parameter
    this.updateAnchorFromUrl();
    $scope.$on('$routeUpdate', () => this.updateAnchorFromUrl());
    $scope.$watch('$ctrl.anchor', anchor => this.updateAnchorToUrl(anchor));

    // trigger resize event when animation of .ph-document-text finishes
    function triggerResize(element, phase) {
      if (!element.hasClass('ph-document-text') || phase !== 'close') return;
      jquery($window).triggerHandler('resize');
    }
    $animate.on('addClass', $element, triggerResize);
    $animate.on('removeClass', $element, triggerResize);

    $scope.$watch('$ctrl.pdfStatus.pdf', pdf => {
      if (!pdf) {
        this.pdfInfo = undefined;
        return;
      }
      this.pdfInfo = {numPages: pdf.numPages};
    });

    $scope.$watchCollection('$ctrl.pdfInfo', pdfInfo => this.onPdfInfoUpdate({pdfInfo}));

    $scope.$watchCollection('$ctrl.documentItems', this.updateAccessibleItem.bind(this));

    // update search index
    $scope.$watch('$ctrl.pdfText', this.updateSearchIndex.bind(this));
    $scope.$watch('$ctrl.searchStr', this.search.bind(this));
  }

  // create link for pdf destinations
  getLinkDest(dest) {
    const segmentName = this.$routeSegment.name;
    const baseUrl = this.$routeSegment
      .getSegmentUrl(segmentName, this.$routeSegment.$routeParams);

    const anchor = isArray(dest)
      ? `pdfdr:${JSON.stringify(dest)}`
      : `pdfd:${dest}`;
    return `.${baseUrl}?a=${encodeURIComponent(anchor)}`;
  }

  getNewDiscussion(discussion) {
    return merge(
      {},
      discussion,
      {
        target: {
          documentItem: this.documentItem.id,
          documentRevision: this.documentItem.revision,
          document: this.documentItem.document,
        },
      },
    );
  }

  updatePdfUrl() {
    this.pdfUrl = this.getPdfUrl();
  }

  getPdfUrl() {
    if (!this.documentItem || !this.documentItem.file || !this.documentItem.file.url) return;

    // if the file available via HTTPS with enabled CORS then just use it
    if (/^https/.test(this.documentItem.file.url) && this.documentItem.file.urlHasCors) {
      return this.documentItem.file.url;
    }

    // No HTTPS/Cors? PaperHive can proxy the document if it's a public open access document.
    const encodedUrl = encodeURIComponent(this.documentItem.file.url);
    return `${this.config.apiUrl}/proxy?url=${encodedUrl}`;
  }

  updateAccessibleItem() {
    this.accessibleItem = undefined;
    this.accessibleItemType = undefined;
    if (!this.documentItem || !this.documentItems) return;

    const revisionItems = this.documentItems.filter(item => item.revision === this.documentItem.revision);

    if (this.authService.user) {
      const ownedItem = revisionItems.find(item => item.owner === this.authService.user.id);
      if (ownedItem) {
        this.accessibleItem = ownedItem;
        this.accessibleItemType = 'owned';
        return;
      }
    }

    const sharedItem = revisionItems.find(item => item.remote.type === 'upload');
    if (sharedItem) {
      this.accessibleItem = sharedItem;
      this.accessibleItemType = 'shared';
      return;
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
    if (!this.filteredDiscussions) return;

    const highlights = this.filteredDiscussions.map(discussion => {
      return {id: discussion.id, selectors: discussion.target.selectors};
    });

    // add draft selectors
    if (this.draftSelectors) {
      highlights.push({id: 'draft', selectors: this.draftSelectors});
    }

    this.highlights = highlights;
  }

  updateSearchIndex() {
    if (!this.pdfInfo) return;
    this.pdfInfo.searchIndex = undefined;
    if (!this.pdfText) return;
    this.pdfInfo.searchIndex = new SearchIndex(this.pdfText);
  }

  uploadRevision() {
    this.documentUploadModalService.open({
      document: this.documentItem.document,
      revision: this.documentItem.revision,
      metadata: this.documentItem.metadata,
    });
  }

  search() {
    this.searchMatches = this.pdfInfo && this.pdfInfo.searchIndex && this.searchStr
      ? this.pdfInfo.searchIndex.search(this.searchStr) : undefined;
    this.onSearchMatchesUpdate({searchMatches: this.searchMatches});
  }
}

export default function(app) {
  app.component('documentItemText', {
    bindings: {
      anchor: '<',
      documentItem: '<',
      documentItems: '<',
      availableChannels: '<',
      discussions: '<',
      filteredDiscussions: '<',
      viewportOffsetTop: '<',
      expanded: '<',
      searchStr: '<',
      searchMatchIndex: '<',

      onDiscussionSubmit: '&',
      onDiscussionUpdate: '&',
      onDiscussionDelete: '&',
      onReplySubmit: '&',
      onReplyUpdate: '&',
      onReplyDelete: '&',
      onPdfInfoUpdate: '&',
      onSearchMatchesUpdate: '&',
    },
    controller: DocumentItemTextCtrl,
    template: require('./document-item-text.html'),
  });
}
