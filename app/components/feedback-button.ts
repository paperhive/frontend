'use strict';

const modal = {
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

export default function(app) {
  app.component('feedbackButton', {

    controller: class FeedbackButtonCtrl {
      static $inject = ['$uibModal'];
      constructor(public $uibModal) {}
      open() {
        this.$uibModal.open(modal);
      }
    },

    template:
    `<a type="link"
       class="ph-badge-left btn btn-primary btn-sm hidden-xs hidden-sm"
       ng-click="$ctrl.open()"
       >
       <i class="fa fa-fw fa-envelope"></i> Feedback
    </a>`
  });
};
