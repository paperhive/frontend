'use strict';

export default function(app) {
  app.component('pdfSearch', {
    bindings: {
      onSearchSubmit: '&',
      large: '<',
    },
    controller: class PdfSearchController {
      onSearchSubmit: any;
      large: boolean;

      submit(str) {
        this.onSearchSubmit({searchStr: str});
      }

      removeSearch() {
        // TODO remove highlight
      }

    },
    template: require('./pdf-search.html'),
  });
};
