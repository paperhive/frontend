module.exports = function (app) {

  app.directive('marginDiscussionDraft', [
    'authService', 'notificationService', '$document', '$rootScope',
    function(authService, notificationService, $document, $rootScope) {
      return {
        restrict: 'E',
        scope: {
          onSubmit: '&',
          annotation: '='
        },
        templateUrl: 'templates/directives/margin-discussion-draft.html',
        link: function(scope, element) {
          scope.auth = authService;
          scope.annotation.author = authService.user;
        }
      };
    }]);
};
