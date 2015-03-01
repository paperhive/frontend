module.exports = function (app) {

  app.directive('createInlineAnnotation', [
    'authService', 'NotificationsService', '$document', '$rootScope',
    function(authService, notificationsService, $document, $rootScope) {
      return {
        restrict: 'E',
        scope: {
          onSave: '&',
          onMousedown: '&',
          onOutsideMousedown: '&',
          serializedSelection: '=',
          body: '='
        },
        templateUrl: 'templates/article/text/create-inline-annotation.html',
        link: function(scope, element) {
          scope.auth = authService;

          // On mousedown anywhere in the document, release the highlighted
          // selection.
          $document.on('mousedown', function(event) {
            if (scope.onOutsideMousedown) {
              // wrap the call in a $rootScope.$apply to make sure Angular
              // updates the scope on changes
              $rootScope.$apply(scope.onOutsideMousedown);
            }
          });
          element.on('mousedown', function(event) {
            if (scope.onMousedown) {
              $rootScope.$apply(function() {
                scope.onMousedown();
              });
            }
            // Stop propagation to $document.on('mousedown', ...).
            event.stopPropagation();
          });

          scope.addDiscussion = function() {
            // We always needs a title.
            // This conditional applies for short inline comments
            // on the PDF.
            if (scope.title === undefined) {
              scope.title = scope.body;
              scope.body = undefined;
            }

            if (!scope.serializedSelection) {
              notificationsService.notifications.push({
                type: 'error',
                message: 'No text selected.'
              });
              return;
            }

            var addToDatabase = function(discussion) {
              // Drop-in replacement for actual database call
              // TODO remove
              discussion._id = "857431";
              discussion.number = 2;
              discussion.originalAnnotation._id = "1242340";
              discussion.originalAnnotation.time = new Date();
              discussion.originalAnnotation.editTime = undefined;
              return discussion;
            };

            var newDiscussion = {
              title: scope.title,
              serializedSelection: scope.serializedSelection,
              originalAnnotation: {
                author: scope.auth.user,
                body: scope.body,
                labels: []
              },
              replies: []
            };
            var discussionInDatabase = addToDatabase(newDiscussion);
            if (scope.onSave !== undefined) {
              scope.onSave({$discussion: discussionInDatabase});
            }

            // finally, flush title and body
            scope.title = undefined;
            scope.body = undefined;
          };
        }
      };
    }]);
};
