import * as jquery from 'jquery';

export default function(app) {
  app.component('documentInfoKudos', {
    bindings: {
      doi: '<',
    },
    controller: class DocumentInfoKudosCtrl {
      doi: string;

      static $inject = ['$element'];
      constructor(public $element) {}

      $onChanges() {
        this.$element.empty();

        if (!this.doi) return;

        // create empty iframe and insert into DOM
        const iframe = jquery(`
          <iframe
            width="100%"
            height="300"
            frameborder="0"
            scrolling="yes"
            style="border:none; overflow:hidden; width:100%;"
          ></iframe>`,
        );
        this.$element.append(iframe);

        // inject basic html with kudos script (and a few style overrides)
        (iframe[0] as HTMLIFrameElement).contentDocument.write(`
          <html>
            <head>
              <style>
                body {
                  margin: 0;
                }
                .kudos-widget .kudos-widget-article,
                .kudos-widget .kudos-widget-use-kudos {
                  border: none !important;
                }
                .kudos-widget .kudos-widget-intro-and-logo {
                  display: none;
                }
              </style>
            </head>
            <body>
              <script src="https://api.growkudos.com/widgets/article/${this.doi}?omit_icons=true"></script>
              <script src="https://api.growkudos.com/widgets/use_kudos/${this.doi}?omit_icons=true"></script>
            </body>
          </html>`,
        );
      }
    },
  });
}
