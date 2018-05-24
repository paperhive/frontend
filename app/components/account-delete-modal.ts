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

      static $inject = ['$http', '$scope', 'authService', 'config'];
      constructor(public $http, public $scope, public authService, public config) {}

      public hasError(field) {
        const form = this.$scope.accountDeleteForm;
        return form && (form.$submitted || form[field].$touched) &&
          form[field].$invalid;
      }

      public submit() {
        this.submitting = true;
        this.succeeded = false;
        // TODO: fix URL
        this.$http.delete(this.config.apiUrl)
          .then(() => {
            this.succeeded = true;
            return this.close();
          })
          .catch(error => this.error = error)
          .finally(() => this.submitting = false);
      }
    },
    template: require('./account-delete-modal.html'),
  });
}
