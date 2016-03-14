'use strict';
export default function(app) {

  app.component(
    'marginDiscussionDraft', {
    bindings: {
      onSubmit: '&',
      onTitleChange: '&',
      onBodyChange: '&',
    },
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
          console.log('scope.comment', $scope.comment);
          $q.when(ctrl.onSubmit({
            $title: $scope.comment.title,
            $body: $scope.comment.body,
          }))
          .finally(function() {
            $scope.state.submitting = false;
          });
        };
      }],
    templateUrl: 'html/directives/marginDiscussionDraft.html',
    });
};
