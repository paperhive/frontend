'use strict';

import template from './margin-discussion-draft.html';

export default function(app) {
  app.component(
    'marginDiscussionDraft', {
    bindings: {
      selectors: '<',
      onSubmit: '&',
      onDiscard: '&',
    },
    template,
    controller: [
      '$scope', '$q', 'authService',
      function($scope, $q, authService) {
        const ctrl = this;
        $scope.auth = authService;
        $scope.comment = {};

        ctrl.submit = function() {
          const discussion = {
            target: {selectors: ctrl.selectors},
            title: $scope.comment.title,
            body: $scope.comment.body,
          };
          ctrl.submitting = true;

          $q.when(ctrl.onSubmit({discussion}))
            .then(data => ctrl.onDiscard())
            .finally(() => ctrl.submitting = false);
        };
      }],
    });
};
