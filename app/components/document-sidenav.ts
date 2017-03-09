export default function(app) {
  app.component('documentSidenav', {
    bindings: {
      activeRevision: '<',
      discussionsCtrl: '<',
      discussionsByRevision: '<',
      documentCtrl: '<',
      open: '<',
      pdfInfo: '<',
      numberSearchResults: '<',
      viewportOffsetTop: '<',
      onToggle: '&',
      onSearchSubmit: '&',
      onSearchMatchIndexUpdate: '&',
    },
    controller: class DocumentSidenavCtrl {
      activeRevision: string;
      documentCtrl: any;
      open: boolean;
      numberSearchResults: number;
      viewportOffsetTop: number;
      onToggle: any;

      kudosOpen = true;
      kudosDoi: string;
      kudosTestedDoi: string;
      publisherLink: string;
      docNav: string;

      static $inject = ['$http', '$scope', 'tourService'];
      constructor(public $http, $scope, public tour) {

        $scope.$watchCollection('$ctrl.documentCtrl.revisions', this.updateKudos.bind(this));
        $scope.$watchCollection('$ctrl.activeRevision', this.updatePublisherLink.bind(this));
      }

      docNavToggle(id) {
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
        this.$http.get(`https://api.growkudos.com/widgets/article/${doi}`)
          .then(
            () => this.kudosDoi = doi,
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
