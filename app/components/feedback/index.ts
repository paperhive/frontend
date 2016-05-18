'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('feedback', {
    bindings: {
      onCancel: '&',
      onSubmitted: '&',
    },
    controller: class FeedbackFormCtrl {
      $inject = ['$scope', 'authService'];
      constructor(public $scope, public authService) {
        if (this.authService.user) {
          this.name = this.authService.user.displayName;
          this.email = this.authService.user.account.email;
        }
      }
      hasError(field) {
        const form = this.$scope.form;
        console.log(form);
        return (form.$submitted || !form[field].$pristine) &&
          form[field].$invalid;
      }
      submit() {
        //TODO
        console.log(this.name, this.email, this.message);
      }
    },
    template
  });
};