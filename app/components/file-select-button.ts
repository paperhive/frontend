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
      public disabled: boolean;
      public dragActive: boolean;
      public onSelect: (o: {file: File}) => void;

      protected fileElement: JQuery;
      protected onFileDialogChange: (e: Event) => void;

      static $inject = ['$element', '$scope'];
      constructor(public $element, $scope) {
        // register handler for file dialog change
        this.onFileDialogChange = event => $scope.$apply(() => this.onFileDialogSelect(event));
        this.fileElement = $element.find('> label > input');
        this.fileElement.on('change', this.onFileDialogChange);

        // counts dragenter events (fires multiple time due to nested elements)
        let enterCount = 0;

        // calling preventDefault() signals a drop zone
        $element.on('dragenter', event => {
          enterCount++;

          if (this.disabled) return;

          event.preventDefault();
          $scope.$apply(() => this.dragActive = true);
        });

        // calling preventDefault() signals a drop zone
        $element.on('dragover', event => {
          if (this.disabled) return;

          event.preventDefault();
        });

        // restore dragActive when done
        $element.on('dragleave', event => {
          enterCount--;

          if (enterCount === 0) {
            $scope.$apply(() => this.dragActive = false);
          }
        });

        // register handler for file drop
        $element.on('drop', event => {
          enterCount = 0;
          $scope.$apply(() => this.dragActive = false);

          if (this.disabled) return;

          event.preventDefault();
          $scope.$apply(() => this.onDrop(event));
        });
      }

      protected onFileDialogSelect(event) {
        if (this.disabled) return;

        const files = event.target.files;

        if (!files || files.length !== 1) {
          this.onSelect(undefined);
          return;
        }
        this.onSelect({file: files[0]});

        // reset file input element for enabling selecting the same file
        // (in case you selected another file in the meantime by dropping it)
        this.fileElement.off('change', this.onFileDialogChange);
        event.target.value = '';
        this.fileElement.on('change', this.onFileDialogChange);
      }

      protected onDrop(event) {
        this.dragActive = false;

        if (this.disabled) return;

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
