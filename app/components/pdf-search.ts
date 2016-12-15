'use strict';

export default function(app) {
  app.component('pdfSearch', {
    bindings: {
      onSearchSubmit: '&',
      large: '<',
      numberSearchResults: '<',
    },
    controller: class PdfSearchController {
      onSearchSubmit: any;
      large: boolean;
      numberSearchResults: number;

      constructor() {
        this.numberSearchResults = 0;
      }

      submit(str) {
        this.onSearchSubmit({searchStr: str});
      }

      removeSearch() {
        this.numberSearchResults = 0;
        // TODO remove highlight
      }

    },
    template: require('./pdf-search.html'),
  });
};
