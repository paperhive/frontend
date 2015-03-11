module.exports = function (app) {

  app.directive('marginDiscussionDraft', [
    'authService',
    function(authService) {
      return {
        restrict: 'E',
        scope: {
          onSubmit: '&',
          comment: '='
        },
        templateUrl: 'templates/directives/margin-discussion-draft.html',
        link: function(scope, element) {
          scope.auth = authService;
        }
      };
    }]);
};
