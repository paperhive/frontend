'use strict';
import * as angular from 'angular';

import template from './margin-discussion-edit.html';

export default function(app) {
  app.component('marginDiscussionEdit', {
    bindings: {
      discussion: '<',
      onSubmit: '&',
      onDiscard: '&',
    },
    template,
    controller: [
      '$scope', '$q',
      function($scope, $q) {
        const ctrl = this;

        ctrl.discussionCopy = angular.copy(ctrl.discussion);

        ctrl.submit = () => {
          $q.when(ctrl.onSubmit({discussion: ctrl.discussionCopy}))
            .then(() => ctrl.onDiscard())
            .finally(() => ctrl.submitting = false);
        };
      },
    ],
  });
}
