'use strict';
export default function(app) {

  app.directive('marginDiscussionDraft', [
    '$q', 'authService',
    function($q, authService) {
      return {
        restrict: 'E',
        scope: {
          onSubmit: '&',
          comment: '='
        },
        templateUrl: 'templates/directives/marginDiscussionDraft.html',
        link: function(scope, element) {
          scope.auth = authService;
          scope.state = {};
          scope.submit = function() {
            scope.state.submitting = true;
            $q.when(scope.onSubmit({$comment: scope.comment}))
              .finally(function() {
                scope.state.submitting = false;
              });
          };
        }
      };
    }]);
};
