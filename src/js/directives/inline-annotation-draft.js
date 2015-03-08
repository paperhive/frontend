module.exports = function (app) {

  app.directive('inlineAnnotationDraft', [
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

          scope.addDiscussion = function() {
            // We always need a title.
            // This conditional applies for short inline comments
            // on the PDF.
            if (scope.annotation.title === undefined) {
              scope.annotation.title = scope.annotation.body;
              scope.annotation.body = undefined;
            }

            if (!scope.annotation.target) {
              notificationService.notifications.push({
                type: 'error',
                message: 'No text selected.'
              });
              return;
            }

            // TODO: store in database
            if (scope.onSave !== undefined) {
              scope.onSave({$annotation: scope.annotation});
            }
          };
        }
      };
    }]);
};
