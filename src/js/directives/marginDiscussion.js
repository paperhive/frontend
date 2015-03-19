'use strict';
module.exports = function(app) {

  app.directive('marginDiscussion', [
    '$q', 'authService',
    function($q, authService) {
      return {
        restrict: 'E',
        scope: {
          discussion: '=',
          onReplySubmit: '&',
        },
        templateUrl: 'templates/directives/marginDiscussion.html',
        link: function(scope, element, attrs) {
          scope.state = {};
          scope.replyDraft = {};
          scope.auth = authService;
          scope.replySubmit = function() {
            scope.state.submitting = true;

            $q.when(scope.onReplySubmit({$reply: scope.replyDraft}))
              .then(function() {
                scope.replyDraft = {};
              })
              .finally(function() {
                scope.state.submitting = false;
              });
          };
        }
      };
    }
  ]);
};
