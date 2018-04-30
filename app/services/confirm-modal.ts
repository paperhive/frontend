import { IModule } from 'angular';

export default function(app: IModule) {
  app.service('confirmModalService', class ConfirmModalService {
    static $inject = ['$uibModal'];
    constructor(public $uibModal) {}

    open({title, message, dismissButtonText, confirmButtonText}) {
      return this.$uibModal.open({
        component: 'confirmModal',
        resolve: {
          title: () => title,
          message: () => message,
          dismissButtonText: () => dismissButtonText,
          confirmButtonText: () => confirmButtonText,
        },
      }).result;
    }
  });
}
