import jquery from 'jquery';

import { isDocumentItemOwnedByUser, isDocumentItemSharedWithUser } from '../utils/document-items';

export default function(app) {
  app.component('documentSidenav', {
    bindings: {
      documentItem: '<',
      documentItems: '<',
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
      onDocumentItemUpdate: '&',
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
      documentItems: any[];
      open: boolean;
      searchMatches: any[];
      searchMatchIndex: number;
      searchStr: string;
      viewportOffsetTop: number;
      onDocumentItemUpdate: (o: {documentItem: any}) => void;
      onSearchUpdate: (o: {searchStr: string, matchIndex: number}) => void;
      onToggle: any;

      kudosOpen = false;
      kudosDoi: string;
      kudosTestedDoi: string;
      publisherLink: string;
      docNav: string;

      onKeydownBind: (event: JQueryEventObject) => void;

      static $inject = ['$http', '$location', '$scope', '$uibModal', '$window',
        'authService', 'confirmModalService', 'documentItemsApi',
        'documentUploadModalService', 'featureFlagsService'];
      constructor(public $http, public $location, $scope, public $uibModal, public $window,
                  public authService, public confirmModalService, public documentItemsApi,
                  public documentUploadModalService, public featureFlagsService,
                ) {
        // $scope.$watch('$ctrl.documentItem', this.updateKudos.bind(this));

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

      deleteDocumentItem() {
        this.confirmModalService
          .open({
            title: 'Delete document?',
            message: 'Are you sure you want to delete this document? The PDF will be permanently deleted.',
            confirmButtonText: 'Delete',
          })
          .then(
            () => this.documentItemsApi.delete(this.documentItem.id).then(() => this.$location.url('/')),
            () => { /* no-op */ },
          );
      }

      docNavToggle(id) {
        if (this.docNav === 'search') {
          this.onSearchUpdate({searchStr: undefined, matchIndex: undefined});
        }
        this.docNav = this.docNav === id ? undefined : id;
      }

      isOwner(documentItem) {
        return isDocumentItemOwnedByUser(documentItem, this.authService.user);
      }

      isSharedWithYou(documentItem) {
        return isDocumentItemSharedWithUser(documentItem, this.authService.user);
      }

      openMetadataModal() {
        return this.$uibModal
          .open({
            backdrop: 'static',
            component: 'documentItemMetadataModal',
            resolve: {documentItem: () => this.documentItem},
          })
          .result
          .then(({documentItem}) => this.onDocumentItemUpdate({documentItem}))
          .catch(() => { /* no-op */});
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

      uploadRevision() {
        this.documentUploadModalService.open({
          document: this.documentItem.document,
          revision: this.documentItem.revision,
          metadata: this.documentItem.metadata,
        });
      }
    },
    template: require('./document-sidenav.html'),
  });
}
