import jquery from 'jquery';

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

      onKeyDownBind: any;

      static $inject = ['$element', '$scope', '$window'];
      constructor(public $element, public $scope: any, public $window) {
        $scope.$watch('$ctrl.numberSearchResults', this.updateSearchResults.bind(this));
        this.onKeyDownBind = this.onKeyDown.bind(this);
        jquery($window).on('keydown', this.onKeyDownBind);
      }

      $onDestroy() {
        jquery(this.$window).off('keydown', this.onKeyDownBind);
      }

      onKeyDown(event) {
        // check if `ctrl` or `cmd` on Mac is pressed
        if ((event.ctrlKey || event.metaKey) && event.keyCode === 70) {
          this.$element.find('input').focus();
          event.preventDefault();
        }
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
