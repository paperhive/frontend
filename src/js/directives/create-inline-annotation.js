module.exports = function (app) {

  app.directive('createInlineAnnotation', [
    'authService', 'NotificationsService', '$document', '$rootScope',
    function(authService, notificationsService, $document, $rootScope) {
      return {
        restrict: 'E',
        scope: {
          onSave: '&',
          annotation: '='
        },
        templateUrl: 'templates/article/text/create-inline-annotation.html',
        link: function(scope, element) {
          scope.auth = authService;
          scope.annotation.author = authService.user._id;

          scope.addDiscussion = function() {
            // We always need a title.
            // This conditional applies for short inline comments
            // on the PDF.
            if (scope.annotation.title === undefined) {
              scope.annotation.title = scope.annotation.body;
              scope.annotation.body = undefined;
            }

            if (!scope.annotation.selection) {
              notificationsService.notifications.push({
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
