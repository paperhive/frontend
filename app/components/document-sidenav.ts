import template from './document-sidenav.html';

export default function(app) {
  app.component('documentSidenav', {
    bindings: {
      revisions: '<',
      latestRevision: '<', // TODO: replace!
      open: '<',
      viewportOffsetTop: '<',
      onToggle: '&',
    },
    controller: class DocumentSidenavCtrl {
      static $inject = ['$http'];
      constructor(public $http) {
        this.kudosOpen = true;
      }

      getDoi() {
        if (!this.revisions) return;
        for (const revision of this.revisions) {
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
            }
          );
      }

      $onChanges() {
        this.updateKudos();
      }
    },
    template,
  });
}
