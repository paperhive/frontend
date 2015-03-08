module.exports = function (app) {

  app.directive('createInlineAnnotation', [
    'authService', 'notificationService', '$document', '$rootScope',
    function(authService, notificationService, $document, $rootScope) {
      return {
        restrict: 'E',
        scope: {
          onSave: '&',
          annotation: '='
        },
        templateUrl: 'templates/article/text/inline-annotation-draft.html',
        link: function(scope, element) {
          scope.auth = authService;
          scope.annotation.author = authService.user;

          scope.onSave({$annotation: scope.annotation});
        }
      };
    }]);
};
