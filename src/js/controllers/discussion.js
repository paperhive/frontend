module.exports = function (app) {
  app.controller('DiscussionCtrl', [
    '$scope', 'authService', '$routeSegment', '$http', 'config',
    'notificationService',
    function($scope, authService, $routeSegment, $http, config,
             notificationService) {

      // fetch discussion
      $http.get(
        config.api_url +
          '/articles/' + $routeSegment.$routeParams.id +
          '/discussions/' + $routeSegment.$routeParams.index
      )
        .success(function (discussion) {
          $scope.discussion = discussion;
        })
        .error(function (data) {
          notificationService.notifications.push({
            type: 'error',
            message: data.message ? data.message : 'could not fetch discussion ' +
              '(unknown reason)'
          });
        });

      $scope.updateTitle = function(newTitle) {
        $scope.discussion.title = newTitle;
        $scope.titleEditMode = false;
      };

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

      $scope.addReply = function (body) {
        reply = {
          body: body
        };
        $scope.submitting = true;
        $http.post(
          config.api_url +
            '/articles/' + $routeSegment.$routeParams.id +
            '/discussions/' + $routeSegment.$routeParams.index +
            '/replies/',
            reply
        )
        .success(function (reply) {
          $scope.submitting = false;
          $scope.discussion.replies.push(reply);
        })
        .error(function (data) {
          $scope.submitting = false;
          notificationService.notifications.push({
            type: 'error',
            message: data.message || 'could not add reply (unknown reason)'
          });
        });
      };

      $scope.isArticleAuthor = function(authorId) {
        var _ = require('lodash');
        var k = _.findWhere($scope.article.authors, {_id: authorId});
        return (k !== undefined);
      };

      $scope.deleteReply = function(deleteId) {
        // TODO remove reply from database, add the following code into the
        // success handler
        var _ = require('lodash');
        var k = _.findIndex($scope.discussion.replies,
                            function (item) {return item._id === deleteId;}
                           );
        if (k < 0) {
          console.log("Reply ", deleteId, " not found.");
          throw PhError("Reply ", deleteId, " not found.");
        }
        // remove if from the list
        $scope.discussion.replies.splice(k, 1);
      };

    }]);
};
