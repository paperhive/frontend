'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('feedback', {
    bindings: {
      onCancel: '&',
      onSubmitted: '&',
    },
    controller: class FeedbackFormCtrl {
      $inject = ['authService'];
      constructor(public authService) {
        if (this.authService.user) {
          this.name = this.authService.user.displayName;
          this.email = this.authService.user.account.email;
        }
      }
      hasError(field) {
        const form = this.form;
        return (form.$submitted || form[field].$touched) &&
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