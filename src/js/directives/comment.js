var _ = require('lodash');

module.exports = function (app) {
  'use strict';

  app.directive('comment', [
    'authService', 'config', '$routeSegment', 'notificationService',
    function(authService, config, $routeSegment, notificationService) {
    return {
      restrict: 'E',
      scope: {
        content: '=',
        onDelete: '&',
        onUpdate: '&',
        requiresBody: '=',
        deletable: '='
      },
      templateUrl: 'templates/directives/comment.html',
      link: function(scope, element, attrs) {
        scope.auth = authService;
        scope.editMode = false;

        scope.$watch('content', function (content) {
          scope.comment = _.cloneDeep(content);
        });

        scope.getUserText = function(item) {
          //return '<strong><a href="#/users/' + item.userName + '">@' + item.userName + '</a></strong>';
          return '@' + item.userName;
        };

        // For a more advanced example, using promises, see
        // <https://github.com/jeff-collins/ment.io/blob/master/ment.io/scripts.js>.
        scope.searchUsers = function(term) {
          // Fill localItems, used as mentio-items in the respective directive.
          var results = [];
          angular.forEach(scope.users, function(item) {
            if (item.userName.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
              results.push(item);
            }
          });
          scope.localItems = results;
        };

        // Needed for access from child scope
        scope.cancel = function () {
          scope.editMode = false;
          scope.comment = _.cloneDeep(scope.content);
        };

        scope.update = function () {
          scope.submitting = true;
          var promise = scope.onUpdate({$comment: scope.comment});
          if (promise) {
            promise.finally(function () {
              scope.submitting = false;
              scope.editMode = false;
            });
          }
        };
        
        scope.delete = function () {
          scope.submitting = true;
          var promise = scope.onDelete({$comment: scope.content});
          if (promise) {
            promise.finally(function () {
              scope.submitting = false;
              scope.editMode = false;
            });
          }
        };
        //scope.annotationBody = null;
        //scope.isEditMode = false;
        //
        // Warn on page close if there still is unsaved text in the reply form.
        scope.$on('$locationChangeStart', function(event) {
          //console.log("isEditOn", scope.isEditOn);
          //console.log("tmpBody === anno.body", scope.tmpBody !== scope.annotation.body);
          if (scope.isEditOn && scope.tmpBody !== scope.annotation.body) {
            var answer = confirm("There is unsaved content in the reply field. Are you sure you want to leave this page?");
            if (!answer) {
              event.preventDefault();
            }
          }
        });
      }
    };
  }]);
};
