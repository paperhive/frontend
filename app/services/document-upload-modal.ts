import { IModule } from 'angular';

export default function(app: IModule) {
  app.service('documentUploadModalService', class DocumentUploadModalService {
    static $inject = ['$location', '$routeSegment', '$uibModal'];
    modalConfig = {
      animation: true,
      backdrop: 'static',
      template: `
        <document-upload-modal
          on-cancel="$ctrl.dismiss()"
          on-uploaded="$ctrl.close(result)"
        ></document-upload-modal>`,
      controllerAs: '$ctrl',
      controller: class ModalCtrl {
        static $inject = ['$uibModalInstance'];
        constructor(public $uibModalInstance) {}

        dismiss() {
          this.$uibModalInstance.dismiss();
        }

        close(documentItem) {
          this.$uibModalInstance.close({documentItem});
        }
      },
    };

    constructor(public $location, public $routeSegment, public $uibModal) {}

    open() {
      return this.$uibModal
        .open(this.modalConfig)
        .result
        .then(({documentItem}) => {
          const url = this.$routeSegment.getSegmentUrl('documentItem', {documentItem: documentItem.id});
          this.$location.url(url);
        })
        .catch(() => { /* ignore error */ });
    }
  });
}
