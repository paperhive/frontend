'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('feedback', {
    bindings: {
      onCancel: '&',
      onSubmitted: '&',
    },
    controller: class FeedbackFormCtrl {
      $inject = ['$http', '$scope', 'authService', 'config'];
      constructor(public $http, public $scope, public authService, public config) {
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
        this.$http.post(this.config.apiUrl + '/feedback/', {
          name: this.name,
          email: this.email,
          message: this.message
        }).then((response) => {
            // this.submitting = false;
            // this.submitted = true;
            this.onSubmitted();
          }, (response) => {
            // this.submitting = false;
            this.error = response.data && response.data.message ||
              'Unknown error';
          });
      }
    },
    template
  });
};