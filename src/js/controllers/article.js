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
      $http.get(config.api_url + '/articles/' + $routeSegment.$routeParams.id)
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
          '/articles/' + $routeSegment.$routeParams.id + '/discussions'
      )
      .success(function (discussions) {
        $scope.discussions = discussions;
        console.log(discussions);
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
        stored: [],
        highlightInfos: {}
      };

      $scope.onPdfLoaded = function () {
        // DEBUG START contains everything related to a annotations
        /*
        $scope.discussions.stored = [{
          _id: _.uniqueId(),
          selection: '0/10/1/0/0/0:35,0/10/1/0/0/0:41',
          author: authService.user,
          title: 'Matrix properties',
          body: 'Is it SPD?',
        }];
        */
        // DEBUG END
      };

      $scope.purgeDraft = function() {
        $scope.discussions.draft = {_id: _.uniqueId()};
      };

      $scope.addDiscussion = function(articleId, annotation) {
        // We always need a title.
        // This conditional applies for short inline comments
        // on the PDF.
        if (!annotation.title) {
          annotation.title = annotation.body;
          annotation.body = undefined;
        }

        discussion = {
          originalAnnotation: {
            title: annotation.title,
            body: annotation.body,
            target: annotation.target,
            tags: annotation.tags
          }
        };

        $scope.submitting = true;
        $http.post(
          config.api_url + '/articles/' + articleId + '/discussions',
          discussion
        )
        .success(function (discussion) {
          $scope.submitting = false;
          $scope.discussions.stored.push(discussion);
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
