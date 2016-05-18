'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('feedback', {
    bindings: {
      onCancel: '&',
      onSubmitted: '&',
    },
    controller: function() {
      const $ctrl = this;

      $ctrl.user = {
        name: '',
        email: '',
        message: '',
      };

      $ctrl.hasError = function(field) {
        const form = $ctrl.form;
        return (form.$submitted || form[field].$touched) &&
          form[field].$invalid;
      };

      $ctrl.submit = function() {
        //TODO
        console.log($ctrl.user);
      };

    },
    template
  });
};