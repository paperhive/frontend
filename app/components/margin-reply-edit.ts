'use strict';
import * as angular from 'angular';

import template from './margin-reply-edit.html!text';

export default function(app) {
  app.component('marginReplyEdit', {
    bindings: {
      reply: '<',
      onSubmit: '&',
      onDiscard: '&',
    },
    template,
    controller: [
      '$scope', '$q',
      function($scope, $q) {
        const ctrl = this;

        ctrl.replyCopy = angular.copy(ctrl.reply);

        ctrl.submit = () => {
          $q.when(ctrl.onSubmit({reply: ctrl.replyCopy}))
            .then(() => ctrl.onDiscard())
            .finally(() => ctrl.submitting = false);
        };
      },
    ],
  });
}
