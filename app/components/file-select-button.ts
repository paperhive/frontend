import { IModule } from 'angular';

require('./file-select-button.less');

export default function(app: IModule) {
  app.component('fileSelectButton', {
    bindings: {
      accept: '<',
      disabled: '<',
      onSelect: '&',
    },
    controller: class FileSelectButtonCtrl {
      public dragActive: boolean;
      public onSelect: (o: {file: File}) => void;

      static $inject = ['$element', '$scope'];
      constructor(public $element, $scope) {
        // register handler for file dialog change
        $element.find('> label > input')
          .on('change', event => $scope.$apply(() => this.onFileDialogSelect(event)));

        // define drop zone
        let enterCount = 0;
        $element.on('dragenter', event => {
          event.preventDefault();
          if (enterCount === 0) {
            $scope.$apply(() => this.dragActive = true);
          }
          enterCount++;
        });
        $element.on('dragover', event => event.preventDefault());
        $element.on('dragleave', event => {
          enterCount--;
          if (enterCount === 0) {
            $scope.$apply(() => this.dragActive = false);
          }
        });

        // register handler for file drop
        $element.on('drop', event => {
          enterCount = 0;
          event.preventDefault();
          $scope.$apply(() => this.onDrop(event));
        });
      }

      protected onFileDialogSelect(event) {
        const files = event.target.files;
        if (!files || files.length !== 1) {
          this.onSelect(undefined);
          return;
        }
        this.onSelect({file: files[0]});
      }

      protected onDrop(event) {
        event.preventDefault();
        this.dragActive = false;

        const files = event.originalEvent.dataTransfer.files;
        if (!files || files.length === 0) {
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
