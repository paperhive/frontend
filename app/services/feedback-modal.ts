import * as angular from 'angular';

export default function(app) {
  app.service('feedbackModal', class FeedbackModal {
    static $inject = ['$uibModal'];
    modalConfig = {
      animation: true,
      backdrop: 'static',
      template: '<feedback on-cancel="$ctrl.close()" on-submitted="$ctrl.close()"></feedback>',
      controllerAs: '$ctrl',
      controller: class ModalCtrl {
        static $inject = ['$uibModalInstance'];
        constructor(public $uibModalInstance) {}
        close() {
          this.$uibModalInstance.close();
        }
      },
    };

    constructor(public $uibModal) {}

    open() {
      this.$uibModal.open(this.modalConfig);
    }
  });
};
