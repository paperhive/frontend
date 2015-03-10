var _ = require('lodash');

module.exports = function (app) {
  app.controller('ArticleCtrl', [
    '$scope', '$route', '$routeSegment', '$document', '$http', 'config',
    'authService', 'notificationService',
    function($scope, $route, $routeSegment, $document, $http, config,
             authService, notificationService) {

      // expose authService
      $scope.auth = authService;
      // Expose the routeSegment to be able to determine the active tab in the
      // template.
      $scope.$routeSegment = $routeSegment;

      // fetch article
      $http.get(
        config.api_url +
          '/articles/' + $routeSegment.$routeParams.articleId
      )
      .success(function (article) {
        $scope.article = article;
      })
      .error(function (data) {
        notificationService.notifications.push({
          type: 'error',
          message: data.message ? data.message : 'could not fetch article ' +
            '(unknown reason)'
        });
      });

      $http.get(
        config.api_url +
          '/articles/' + $routeSegment.$routeParams.articleId + '/discussions'
      )
      .success(function (discussions) {
        $scope.discussions.stored = discussions;
      })
      .error(function (data) {
        notificationService.notifications.push({
          type: 'error',
          message: data.message ? data.message : 'could not fetch discussions ' +
            '(unknown reason)'
        });
      });

      $scope.discussions = {
        draft: {_id: _.uniqueId()},
        stored: []
      };

      $scope.purgeDraft = function() {
        $scope.discussions.draft = {_id: _.uniqueId()};
      };


      $scope.addDiscussion = function(annotation) {
        // We always need a title.
        // This conditional applies for short inline comments
        // on the PDF.
        if (!annotation.title) {
          annotation.title = annotation.body;
          annotation.body = undefined;
        }

        discussion = {
          originalAnnotation: _.cloneDeep(_.pick(
            annotation, ['title', 'body', 'target', 'tags']
          ))
        };

        $scope.submitting = true;
        $http.post(
          config.api_url +
            '/articles/' + $routeSegment.$routeParams.articleId +
            '/discussions',
          discussion
        )
        .success(function (discussion) {
          $scope.submitting = false;
          $scope.discussions.stored.push(discussion);
          $scope.purgeDraft();
        })
        .error(function (data) {
          $scope.submitting = false;
          notificationService.notifications.push({
            type: 'error',
            message: data.message || 'could not add discussion (unknown reason)'
          });
        });
      };

    }]);
};
