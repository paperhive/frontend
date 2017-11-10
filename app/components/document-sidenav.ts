import jquery from 'jquery';

export default function(app) {
  app.component('documentSidenav', {
    bindings: {
      activeRevision: '<',
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
      onToggle: '&',
      onSearchUpdate: '&',
    },
    controller: class DocumentSidenavCtrl {
      activeRevision: string;
      documentCtrl: any;
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

      static $inject = ['$http', '$scope', '$window'];
      constructor(public $http, $scope, public $window) {

        $scope.$watchCollection('$ctrl.documentCtrl.revisions', this.updateKudos.bind(this));
        $scope.$watchCollection('$ctrl.activeRevision', this.updatePublisherLink.bind(this));

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

      getDoi() {
        if (!this.documentCtrl.revisions) return;
        for (const revision of this.documentCtrl.revisions) {
          if (revision.doi) return revision.doi;
        }
      }

      // i can haz kudos?
      updateKudos() {
        const doi = this.getDoi();

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

      updatePublisherLink() {
        this.publisherLink = this.activeRevision &&
          this.documentCtrl.getRevisionPublisherLink(this.activeRevision);
      }
    },
    template: require('./document-sidenav.html'),
  });
}
