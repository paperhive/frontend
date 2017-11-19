import { IModule } from 'angular';

require('./file-select-button.less');

export default function(app: IModule) {
  app.component('fileSelectButton', {
    bindings: {
      onSelect: '&',
    },
    controller: class FileSelectButtonCtrl {
      public onSelect: (file: File) => void;

      static $inject = ['$element'];
      constructor(public $element) {
        $element.on('change', event => this.select(event));
      }

      protected select(event) {
        const files = event.target.files;
        if (!files || files.length !== 1) {
          this.onSelect(undefined);
          return;
        }
        this.onSelect(files[0]);
      }
    },
    template: require('./file-select-button.html'),
  });
}
