'use strict';

import template from './template.html!text';

export default function(app) {
  app.component(
    'marginDiscussionDraft', {
    bindings: {
      onSubmit: '&',
      onTitleChange: '&',
      onBodyChange: '&',
    },
    template,
    controller: [
      '$scope', '$q', 'authService',
      function($scope, $q, authService) {
        const ctrl = this;
        $scope.auth = authService;
        $scope.state = {};
        $scope.comment = {};
        $scope.$watch('comment.title', function(data) {
          ctrl.onTitleChange({$title: data});
        });
        $scope.$watch('comment.body', function(data) {
          ctrl.onBodyChange({$body: data});
        });
        $scope.submit = function() {
          $scope.state.submitting = true;
          $q.when(ctrl.onSubmit({
            $title: $scope.comment.title,
            $body: $scope.comment.body,
          }))
          .finally(function() {
            $scope.state.submitting = false;
          });
        };
      }],
    });
};
