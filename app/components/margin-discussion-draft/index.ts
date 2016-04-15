'use strict';

import template from './template.html!text';

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
          ctrl.submitting = true;
          $q.when(ctrl.onSubmit({
            selectors: ctrl.selectors,
            title: $scope.comment.title,
            body: $scope.comment.body,
          }))
          .finally(function() {
            ctrl.submitting = false;
          });
        };
      }],
    });
};
