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

      static $inject = ['$element', '$scope', '$timeout'];
      constructor(public $element, public $scope, public $timeout) {
        $scope.$watch('$ctrl.searchStr', str => this.searchStrModel = str);
        $timeout(() => $element.find('input').focus(), 50);
      }

      onKeypress($event) {
        // enter
        if ($event.keyCode === 13) {
          if (this.searchStrModel === this.searchStr) {
            if ($event.shiftKey) this.previous();
            else this.next();
          } else {
            this.onUpdate({searchStr: this.searchStrModel, matchIndex: undefined});
          }
        }
      }

      onKeyup($event) {
        // note: esc does not trigger keypress
        if ($event.keyCode === 27) {
          this.close();
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
