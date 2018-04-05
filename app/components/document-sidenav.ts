import jquery from 'jquery';

import { isDocumentItemSharedWithUser } from '../utils/document-items';

export default function(app) {
  app.component('documentSidenav', {
    bindings: {
      documentItem: '<',
      documentSubscriptions: '<',
      discussionsCtrl: '<',
      discussionsByRevision: '<',
      documentCtrl: '<',
      open: '<',
      pdfInfo: '<',
      searchMatches: '<',
      searchMatchIndex: '<',
      searchStr: '<',
      viewportOffsetTop: '<',
      onAnchorUpdate: '&',
      onAddBookmark: '&',
      onRemoveBookmark: '&',
      onAddShare: '&',
      onRemoveShare: '&',
      onAddDocumentSubscription: '&',
      onRemoveDocumentSubscription: '&',
      onToggle: '&',
      onSearchUpdate: '&',
    },
    controller: class DocumentSidenavCtrl {
      documentItem: any;
      open: boolean;
      searchMatches: any[];
      searchMatchIndex: number;
      searchStr: string;
      viewportOffsetTop: number;
      onSearchUpdate: (o: {searchStr: string, matchIndex: number}) => void;
      onToggle: any;

      kudosOpen = false;
      kudosDoi: string;
      kudosTestedDoi: string;
      publisherLink: string;
      docNav: string;

      onKeydownBind: (event: JQueryEventObject) => void;

      static $inject = ['$http', '$scope', '$window', 'authService'];
      constructor(public $http, $scope, public $window, public authService) {

        $scope.$watch('$ctrl.documentItem', this.updateKudos.bind(this));

        this.onKeydownBind = this.onKeydown.bind(this);
        jquery($window).on('keydown', this.onKeydownBind);
      }

      $onDestroy() {
        jquery(this.$window).off('keydown', this.onKeydownBind);
      }

      onKeydown(event: JQueryKeyEventObject) {
        // check if ctrl+f or cmd+f (Mac) is pressed
        if ((event.ctrlKey || event.metaKey) && event.keyCode === 70) {
          if (this.docNav !== 'search') this.docNavToggle('search');
          event.preventDefault();
        }
      }

      docNavToggle(id) {
        if (this.docNav === 'search') {
          this.onSearchUpdate({searchStr: undefined, matchIndex: undefined});
        }
        this.docNav = this.docNav === id ? undefined : id;
      }

      isSharedWithYou(documentItem) {
        return isDocumentItemSharedWithUser(documentItem, this.authService.user);
      }

      // i can haz kudos?
      updateKudos() {
        const doi = this.documentItem && this.documentItem.metadata.doi;

        // reset kudosDoi if no doi is available
        if (!doi) {
          this.kudosDoi = undefined;
          return;
        }

        // check if this doi has already been tested
        if (doi === this.kudosTestedDoi) return;
        this.kudosTestedDoi = doi;

        // test doi against kudos server
        this.$http.get(`https://api.growkudos.com/articles/${doi}`)
          .then(
            response => {
              const data = response.data;

              this.kudosDoi = doi;
              this.kudosOpen =
                data.author_perspectives && data.author_perspectives.length > 0 ||
                data.impact_statement ||
                data.lay_summary;
            },
            response => {
              if (response.status !== 404) {
                throw new Error(`Error testing DOI on Kudos (status ${response.status})`);
              }
            },
          );
      }
    },
    template: require('./document-sidenav.html'),
  });
}
