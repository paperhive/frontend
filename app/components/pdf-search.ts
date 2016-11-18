'use strict';

import template from './pdf-search.html';

export default function(app) {
  app.component('pdfSearch', {
    bindings: {
      onSearchSubmit: '&',
    },
    controller: class PdfSearchController {
      constructor() {}

      submit(str) {
        this.onSearchSubmit({searchStr: str});
      }

    },
    template,
  });
};
