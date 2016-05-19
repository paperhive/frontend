'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('feedback', {
    bindings: {
      onCancel: '&',
      onSubmitted: '&',
    },
    controller: class FeedbackFormCtrl {
      $inject = ['$http', '$location', '$scope', 'authService', 'config', 'notificationService'];
      constructor(public $http, public $location, public $scope, public authService, public config, public notificationService) {
        if (this.authService.user) {
          this.name = this.authService.user.displayName;
          this.email = this.authService.user.account.email;
        }
      }
      hasError(field) {
        const form = this.$scope.form;
        return (form.$submitted || !form[field].$pristine) &&
          form[field].$invalid;
      }

      submit() {
        this.submitting = true;
        this.error = undefined;
        this.$http.post(this.config.apiUrl + '/feedback/', {
          name: this.name,
          email: this.email,
          message: this.message,
          url: this.$location.absUrl(),
        }).then((response) => {
            this.submitting = false;
            this.onSubmitted();
          }, (response) => {
            this.submitting = false;
            this.error = response.data && response.data.message ||
              'Unknown error';
          });
      }
    },
    template
  });
};