import { IModule } from 'angular';

export default function(app: IModule) {
  app.component('documentUploadModal', {
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '<',
    },
    controller: class DocumentUploadModalCtrl {
      public error: string;
      public selectedFile: File;
      public submitting = false;
      public submittedBytes: number;
      public close: (o: {$value: any}) => void;

      static $inject = ['$scope', 'documentItemsApi'];
      constructor(public $scope, public documentItemsApi) {}

      public async submit() {
        this.$scope.$applyAsync(() => {
          this.submitting = true;
          this.submittedBytes = 0;
        });

        try {
          const documentItem = await this.documentItemsApi.upload(
            this.selectedFile,
            ({submittedBytes}) => this.$scope.$applyAsync(() => this.submittedBytes = submittedBytes),
          );

          this.$scope.$applyAsync(() => {
            this.close({$value: {documentItem}});
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
