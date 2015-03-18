'use strict';
var _ = require('lodash');

module.exports = function(app) {

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
        config.apiUrl +
          '/articles/' + $routeSegment.$routeParams.articleId
      )
      .success(function(article) {
        $scope.article = article;
      })
      .error(function(data) {
        notificationService.notifications.push({
          type: 'error',
          message: data.message ? data.message : 'could not fetch article ' +
            '(unknown reason)'
        });
      });

      $http.get(
        config.apiUrl +
          '/articles/' + $routeSegment.$routeParams.articleId + '/discussions'
      )
      .success(function(discussions) {
        $scope.discussions.stored = discussions;
      })
      .error(function(data) {
        notificationService.notifications.push({
          type: 'error',
          message: data.message ? data.message :
            'could not fetch discussions (unknown reason)'
        });
      });

      $scope.originalComment = {
        draft: {}
      };
      $scope.discussions = {
        stored: []
      };

      $scope.purgeDraft = function() {
        $scope.originalComment.draft = {};
      };

      $scope.addDiscussion = function(comment) {
        var originalComment = _.cloneDeep(_.pick(
          comment, ['title', 'body', 'target', 'tags']
        ));

        // We always need a title.
        // This conditional applies for short inline comments on the PDF.
        if (!originalComment.title) {
          originalComment.title = originalComment.body;
          originalComment.body = undefined;
        }

        $scope.submitting = true;
        return $http.post(
          config.apiUrl +
            '/articles/' + $routeSegment.$routeParams.articleId +
            '/discussions',
          {originalAnnotation: originalComment}
        )
        .success(function(discussion) {
          $scope.submitting = false;
          $scope.discussions.stored.push(discussion);
          $scope.purgeDraft();
        })
        .error(function(data) {
          $scope.submitting = false;
        })
          .error(notificationService.httpError('could not add discussion'));
      };

      $scope.addReply = function(discussion, reply) {
        reply = _.cloneDeep(_.pick(
          reply, ['title', 'body']
        ));
        return $http.post(
          config.apiUrl +
            '/articles/' + $routeSegment.$routeParams.articleId +
            '/discussions/' + discussion.index +
            '/replies',
          reply
        )
        .success(function(reply) {
          discussion.replies.push(reply);
        })
          .error(notificationService.httpError('could not add reply'));
      };

    }]);
};
