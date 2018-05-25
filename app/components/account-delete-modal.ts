import {localStorageAvailable} from '../utils/local-storage';

export default function(app) {
  app.component('accountDeleteModal', {
    bindings: {
      close: '&',
      dismiss: '&',
    },
    controller: class DocumentItemMetadataModalCtrl {
      close: () => void;

      public error: string;
      public submitting = false;
      public succeeded = false;

      static $inject = [
        '$http', '$location', '$scope', '$window',
        'authService', 'notificationService', 'peopleApi',
      ];
      constructor(
        public $http, public $location, public $scope, public $window,
        public authService, public notificationService, public peopleApi,
      ) {}

      public hasError(field) {
        const form = this.$scope.accountDeleteForm;
        return form && (form.$submitted || form[field].$touched) &&
          form[field].$invalid;
      }

      public submit() {
        this.submitting = true;
        this.succeeded = false;
        this.peopleApi.deleteAccount(this.authService.user.id)
          .then(() => {
            this.succeeded = true;
            this.authService.logout();
            if (localStorageAvailable) this.$window.localStorage.clear();
            this.notificationService.notifications.push({
              type: 'info',
              message: 'Your account has been successfully deleted.',
            });
            this.$location.url('/');
            return this.close();
          })
          .catch(error => this.error = error)
          .finally(() => this.submitting = false);
      }
    },
    template: require('./account-delete-modal.html'),
  });
}
