'use strict';

export default function(app) {
  app.component('pdfSearch', {
    bindings: {
      onSearchSubmit: '&',
      large: '<',
      numberSearchResults: '<',
    },
    controller: class PdfSearchController {
      indexSearchResults: number;
      large: boolean;
      numberSearchResults: number;
      onSearchSubmit: any;

      constructor() {
        this.numberSearchResults = 0;
        this.indexSearchResults = 0;
      }

      submit(str) {
        this.onSearchSubmit({searchStr: str});
      }

      nextResult() {
        (this.indexSearchResults !== this.numberSearchResults) ?
          this.indexSearchResults++ : this.indexSearchResults = 1;
        // TODO scroll to result
      }

      previousResult() {
        (this.indexSearchResults !== 1) ?
          this.indexSearchResults-- : this.indexSearchResults = this.numberSearchResults;
        // TODO scroll to result
      }

      removeSearch() {
        this.numberSearchResults = 0;
        // TODO remove highlight
      }

    },
    template: require('./pdf-search.html'),
  });
};
