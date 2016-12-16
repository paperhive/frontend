'use strict';

export default function(app) {
  app.component('pdfSearch', {
    bindings: {
      large: '<',
      numberSearchResults: '<',
      onSearchSubmit: '&',
    },
    controller: class PdfSearchController {
      indexSearchResults: number;
      large: boolean;
      numberSearchResults: number;
      onSearchSubmit: any;

      static $inject = ['$scope'];
      constructor(public $scope: any) {
        $scope.$watch('$ctrl.numberSearchResults', this.updateSearchResults.bind(this));
      }

      updateSearchResults() {
        if (this.numberSearchResults > 0) {
          this.indexSearchResults = 1;
        }
        if (this.numberSearchResults === 0) {
          this.indexSearchResults = 0;
        }
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
        // remove highlight
        this.onSearchSubmit({searchStr: undefined});
      }

    },
    template: require('./pdf-search.html'),
  });
};
