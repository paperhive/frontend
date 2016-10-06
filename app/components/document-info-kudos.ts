import angular from 'angular';

export default function(app) {
  app.component('documentInfoKudos', {
    bindings: {
      revisions: '<',
    },
    controller: class DocumentInfoKudosCtrl {
      static $inject = ['$http', '$element'];
      constructor(public $http, public $element) {}

      getDoi() {
        if (!this.revisions) return;
        for (const revision of this.revisions) {
          if (revision.doi) return revision.doi;
        }
      }

      $onChanges() {
        this.$element.empty();
        const doi = this.getDoi();
        if (!doi) return;

        // create empty iframe
        const iframe = angular.element(`
          <iframe
            width="100%"
            height="300"
            frameborder="0"
            scrolling="yes"
            style="border:none; overflow:hidden; width:100%;"
          ></iframe>`
        );
        this.$element.append(iframe);

        // insert basic html with kudos script
        iframe[0].contentDocument.write(`
          <html>
            <head>
              <style>
                .kudos-widget .kudos-widget-article {
                  border: none !important;
                }
              </style>
            </head>
            <body>
              <script src="https://api.growkudos.com/widgets/article/${doi}"></script>
            </body>
          </html>`
        );
      }
    }
  });
}
