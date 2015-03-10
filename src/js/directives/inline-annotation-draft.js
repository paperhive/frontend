module.exports = function (app) {

  app.directive('inlineAnnotationDraft', [
    'authService', 'notificationService', '$document', '$rootScope',
    function(authService, notificationService, $document, $rootScope) {
      return {
        restrict: 'E',
        scope: {
          onSubmit: '&',
          annotation: '='
        },
        templateUrl: 'templates/article/text/inline-annotation-draft.html',
        link: function(scope, element) {
          scope.auth = authService;
          scope.annotation.author = authService.user;
        }
      };
    }]);
};
