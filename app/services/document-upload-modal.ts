import { IModule } from 'angular';

export default function(app: IModule) {
  app.service('documentUploadModalService', class DocumentUploadModalService {
    static $inject = ['$uibModal'];
    modalConfig = {
      animation: true,
      backdrop: 'static',
      template: `
        <document-upload-modal
          on-cancel="$ctrl.close()"
          on-uploaded="$ctrl.close(result)"
        ></document-upload-modal>`,
      controllerAs: '$ctrl',
      controller: class ModalCtrl {
        static $inject = ['$uibModalInstance'];
        constructor(public $uibModalInstance) {}
        close(result) {
          this.$uibModalInstance.close(result);
        }
      },
    };

    constructor(public $uibModal) {}

    open() {
      return this.$uibModal.open(this.modalConfig);
    }
  });
}
