import { IModule } from 'angular';

require('./file-select-button.less');

export default function(app: IModule) {
  app.component('fileSelectButton', {
    bindings: {
      accept: '<',
      required: '<',
      onSelect: '&',
    },
    controller: class FileSelectButtonCtrl {
      public onSelect: (o: {file: File}) => void;

      static $inject = ['$element'];
      constructor(public $element) {
        $element.find('> label > input').on('change', event => this.select(event));
      }

      protected select(event) {
        const files = event.target.files;
        if (!files || files.length !== 1) {
          this.onSelect(undefined);
          return;
        }
        this.onSelect({file: files[0]});
      }
    },
    template: require('./file-select-button.html'),
    transclude: true,
  });
}
