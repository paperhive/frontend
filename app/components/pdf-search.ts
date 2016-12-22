'use strict';

export default function(app) {
  app.component('pdfSearch', {
    bindings: {
      large: '<',
      numberSearchResults: '<',
      onSearchSubmit: '&',
      onSearchMatchIndexUpdate: '&',
    },
    controller: class PdfSearchController {
      indexSearchResults: number;
      large: boolean;
      numberSearchResults: number;
      onSearchSubmit: any;
      onSearchMatchIndexUpdate: any;
      searchedStr: string;

      static $inject = ['$scope'];
      constructor(public $scope: any) {
        $scope.$watch('$ctrl.numberSearchResults', this.updateSearchResults.bind(this));
      }

      updateSearchResults() {
        if (this.numberSearchResults > 0) {
          this.indexSearchResults = 0;
        }
        if (this.numberSearchResults === 0) {
          this.indexSearchResults = undefined;
        }
        this.onSearchMatchIndexUpdate({indexSearchResults: this.indexSearchResults});
      }

      submit(str) {
        if (str === this.searchedStr && this.numberSearchResults > 0) {
          this.nextResult();
        } else {
          this.onSearchSubmit({searchStr: str});
        }
        this.searchedStr = str;
      }

      nextResult() {
        if (this.indexSearchResults < this.numberSearchResults - 1) {
          this.indexSearchResults++;
        } else {
          this.indexSearchResults = 0;
        }
        this.onSearchMatchIndexUpdate({indexSearchResults: this.indexSearchResults});
      }

      previousResult() {
        if (this.indexSearchResults > 0) {
          this.indexSearchResults--;
        } else {
          this.indexSearchResults = this.numberSearchResults - 1;
        }
        this.onSearchMatchIndexUpdate({indexSearchResults: this.indexSearchResults});
      }

      removeSearch() {
        // remove highlight
        this.onSearchSubmit({searchStr: undefined});
        this.onSearchMatchIndexUpdate({indexSearchResults: undefined});
      }

    },
    template: require('./pdf-search.html'),
  });
};
