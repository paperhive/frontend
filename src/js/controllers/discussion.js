var _ = require('lodash');

module.exports = function (app) {
  app.controller('DiscussionCtrl', [
    '$scope', 'authService', '$routeSegment', '$http', 'config',
    'notificationService',
    function($scope, authService, $routeSegment, $http, config,
             notificationService) {

      // fetch discussion
      $http.get(
        config.api_url +
          '/articles/' + $routeSegment.$routeParams.articleId +
          '/discussions/' + $routeSegment.$routeParams.discussionIndex
      )
      .success(function (discussion) {
        $scope.discussion = discussion;
      })
      .error(notificationService.httpError('could not fetch discussion'));

        // Problem:
        //   When updateTitle() is run, the newTitle needs to be populated in
        //   the scope. This may not necessarily be the case.
        // Workaround:
        //   Explicitly set the newTitle in the $scope.
        // Disadvantage:
        //   The title is set twice, and this is kind of ugly.
        // TODO find a better solution
        $scope.updateTitle = function(newTitle) {
          $scope.discussion.originalAnnotation.title = newTitle;
          $scope.updateDiscussion($scope.discussion.originalAnnotation);
        };

        $scope.updateDiscussion = function(comment) {
          $scope.submitting = true;
          var newDiscussion = {
            originalAnnotation: _.pick(
              comment,
              ['title', 'body', 'target', 'tags']
            )
          };

          return $http.put(
            config.api_url +
              '/articles/' + $routeSegment.$routeParams.articleId +
              '/discussions/' + $routeSegment.$routeParams.discussionIndex,
            newDiscussion
          )
          .success(function (discussion) {
            $scope.submitting = false;
            $scope.discussion.originalAnnotation = discussion.originalAnnotation;
          })
          .error(function (data) {
            $scope.submitting = false;
          })
          .error(notificationService.httpError('could not update discussion'));
        };
      
      $scope.addReply = function (body) {
        $scope.submitting = true;
        $http.post(
          config.api_url +
            '/articles/' + $routeSegment.$routeParams.articleId +
            '/discussions/' + $routeSegment.$routeParams.discussionIndex +
            '/replies/',
          {body: body}
        )
        .success(function (reply) {
          $scope.submitting = false;
          $scope.discussion.replies.push(reply);
        })
        .error(function (data) {
          $scope.submitting = false;
        })
        .error(notificationService.httpError('could not update reply'));
      };

      $scope.updateReply = function (comment, index) {
        return $http.put(
          config.api_url +
            '/articles/' + $routeSegment.$routeParams.articleId +
            '/discussions/' + $routeSegment.$routeParams.discussionIndex +
            '/replies/' + comment._id,
          {body: comment.body}
        )
        .success(function (data) {
          $scope.discussion.replies[index] = data;
        })
        .error(notificationService.httpError('could not update reply'));
      };

      $scope.deleteReply = function (comment, index) {
        return $http.delete(
          config.api_url +
            '/articles/' + $routeSegment.$routeParams.articleId +
            '/discussions/' + $routeSegment.$routeParams.discussionIndex +
            '/replies/' + comment._id
        )
        .success(function (data) {
          $scope.discussion.replies.splice(index, 1);
        })
        .error(notificationService.httpError('could not delete reply'));
      };

      // currently unused
      /*
      $scope.subscribers = [
      ];
      if('user' in authService) {
        $scope.isSubscribed = $scope.subscribers.indexOf(authService.user._id) > -1;
      } else {
        $scope.isSubscribed = false;
      }
      $scope.toggleSubscribe = function() {
        var k = $scope.subscribers.indexOf(authService.user._id);
        if (k > -1) {
          // remove from to subscribers list
          $scope.subscribers.splice(k, 1);
          $scope.isSubscribed = false;
        } else {
          // add to subscribers list
          $scope.subscribers.push(authService.user._id);
          $scope.isSubscribed = true;
        }
      };

      $scope.isArticleAuthor = function(authorId) {
        var _ = require('lodash');
        var k = _.findWhere($scope.article.authors, {_id: authorId});
        return (k !== undefined);
      };
      */
    }]);
};
