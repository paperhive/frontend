import { IModule } from 'angular';

export default function(app: IModule) {
  app.component('documentUploadModal', {
    bindings: {
      onCancel: '&',
      onUploaded: '&',
    },
    controller: class DocumentUploadModalCtrl {
      public error: string;
      public selectedFile: File;
      public submitting = false;
      public submittedBytes: number;
      public onUploaded: (o: {result: any}) => void;

      static $inject = ['$scope', 'DocumentController'];
      constructor(public $scope, public _DocumentController) {}

      public async submit() {
        this.$scope.$applyAsync(() => {
          this.submitting = true;
          this.submittedBytes = 0;
        });

        try {
          const result = await this._DocumentController.upload(
            this.selectedFile,
            ({submittedBytes}) => this.$scope.$applyAsync(() => this.submittedBytes = submittedBytes),
          );

          this.$scope.$applyAsync(() => {
            this.onUploaded({result});
          });
        } catch (error) {
          this.$scope.$applyAsync(() => {
            this.error = error.message;
            this.submitting = false;
          });
        }
      }
    },
    template: require('./document-upload-modal.html'),
  });
}
