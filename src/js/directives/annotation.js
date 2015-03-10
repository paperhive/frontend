module.exports = function (app) {

  app.directive('annotation', [
    '$http', 'config', '$routeSegment', 'notificationService',
    function($http, config, $routeSegment, notificationService) {
    return {
      restrict: 'E',
      scope: {
        annotation: '=content',
        // For some reason, we can't use one-directional ('@') binding here,
        // cf. <http://stackoverflow.com/a/18016206/353337>.
        isArticleAuthor: "=",
        deleteFunction: "=",
        requiresBody: "="
      },
      templateUrl: 'templates/articles/comment/comment.html',
      link: function(scope, element, attrs) {
        scope.isEditMode = false;

        scope.tmpBody = undefined;

        scope.getPeopleText = function(item) {
          //return '<strong><a href="#/users/' + item.userName + '">@' + item.userName + '</a></strong>';
          return '@' + item.userName;
        };

        // For a more advanced example, using promises, see
        // <https://github.com/jeff-collins/ment.io/blob/master/ment.io/scripts.js>.
        scope.searchPeople = function(term) {
          // Fill localItems, used as mentio-items in the respective directive.
          var results = [];
          angular.forEach(scope.users, function(item) {
            if (item.userName.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
              results.push(item);
            }
          });
          scope.localItems = results;
        };

        scope.updateAnnotation = function(newBody) {
          scope.annotation.body = newBody;
          scope.isEditMode = false;

          scope.submitting = true;

          var updatedDiscussion = {
            originalAnnotation: {
              title: scope.annotation.title,
              body: newBody,
              tags: scope.annotation.tags,
              target: scope.annotation.target
            }
          };

          $http.put(
            config.api_url +
              '/articles/' + $routeSegment.$routeParams.articleId +
              '/discussions/' + $routeSegment.$routeParams.discussionIndex,
            updatedDiscussion
          )
          .success(function (discussion) {
            scope.submitting = false;
            scope.annotation = discussion.originalAnnotation;
          })
          .error(function (data) {
            scope.submitting = false;
            notificationService.notifications.push({
              type: 'error',
              message: data.message || 'could not add discussion (unknown reason)'
            });
          });
        };

        // Needed for access from child scope
        scope.setEditOn = function () {
          scope.isEditMode = true;
          scope.tmpBody = scope.annotation.body;
        };

        // Needed for access from child scope
        scope.setEditOff = function () {
          scope.isEditMode = false;
        };
        //scope.auth = authService;
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
