'use strict';

import template from './pdf-search.html';

export default function(app) {
  app.component('pdfSearch', {
    bindings: {
      onSearchSubmit: '&',
      large: '<',
    },
    controller: class PdfSearchController {
      constructor() {}

      submit(str) {
        this.onSearchSubmit({searchStr: str});
      }

      removeSearch() {
        // TODO remove highlight
      }

    },
    template,
  });
};
