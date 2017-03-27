import jquery from 'jquery';

require('./document-sidenav-search.less');

export default function(app) {
  app.component('documentSidenavSearch', {
    bindings: {
      large: '<',
      matches: '<',
      matchIndex: '<',
      searchStr: '<',
      onClose: '&',
      onUpdate: '&',
    },
    controller: class DocumenSidenavSearchCtrl {
      large: boolean;
      matches: any[];
      matchIndex: number;
      searchStr: string;
      onClose: () => void;
      onUpdate: (o: {searchStr: string, matchIndex: number}) => void;

      onKeyDownBind: any;
      searchStrModel: string;

      static $inject = ['$element', '$scope', '$timeout', '$window'];
      constructor(public $element, public $scope, public $timeout, public $window) {
        $scope.$watch('$ctrl.searchStr', str => this.searchStrModel = str);
        $timeout(() => $element.find('input').focus(), 50);
      }

      submit() {
        if (this.searchStrModel === this.searchStr) {
          this.next();
        } else {
          this.onUpdate({searchStr: this.searchStrModel, matchIndex: undefined});
        }
      }

      next() {
        if (!this.matches || this.matches.length === 0) return;
        const matchIndex = this.matchIndex < this.matches.length - 1
          ? this.matchIndex + 1 : 0;
        this.onUpdate({searchStr: this.searchStr, matchIndex});
      }

      previous() {
        if (!this.matches || this.matches.length === 0) return;
        const matchIndex = this.matchIndex > 0 ? this.matchIndex - 1 : this.matches.length - 1;
        this.onUpdate({searchStr: this.searchStr, matchIndex});
      }

      close() {
        this.onUpdate({searchStr: undefined, matchIndex: undefined});
        this.onClose();
      }

    },
    template: require('./document-sidenav-search.html'),
  });
};
