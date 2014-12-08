module.exports = function (app) {
  app.controller('DiscussionCtrl', [
    '$scope', 'AuthService', '$routeParams',
    function($scope, AuthService, $routeParams) {

      $scope.titleEditMode = false;

      // retrieve the discussion
      var _ = require('underscore');
      //var k = _.find($scope.article.discussions,
      //               function(obj){ return obj.number == parseInt($routeParams.num)}
      //              );
      $scope.discussion = _.findWhere($scope.article.discussions,
                                      {"number": parseInt($routeParams.num)}
                                     );
      if ($scope.discussion === undefined) {
        throw PhError("Discussion not found.");
      }

      $scope.setTitleEditOn = function() {
        $scope.tmpTitle = $scope.discussion.title;
        $scope.titleEditMode = true;
      }
      $scope.setTitleEditOff = function() {
        $scope.titleEditMode = false;
      }
      $scope.updateTitle = function(newTitle) {
        $scope.discussion.title = newTitle();
        $scope.titleEditMode = false;
      }

      $scope.subscribers = [
      ];
      if('user' in AuthService) {
        $scope.isSubscribed = $scope.subscribers.indexOf(AuthService.user._id) > -1;
      } else {
        $scope.isSubscribed = false;
      }
      $scope.toggleSubscribe = function() {
        var k = $scope.subscribers.indexOf(AuthService.user._id);
        if (k > -1) {
          // remove from to subscribers list
          $scope.subscribers.splice(k, 1);
          $scope.isSubscribed = false;
        } else {
          // add to subscribers list
          $scope.subscribers.push(AuthService.user._id);
          $scope.isSubscribed = true;
        }
      };

      $scope.addReply = function() {
        if (!$scope.auth.user) {
            throw PhError("Not logged in?");
        }
        // create the annotation
        reply = {
          _id: Math.random().toString(36).slice(2),
          author: $scope.auth.user,
          body: $scope.annotationBody,
          time: new Date(),
          labels: ["reply"]
        };
        $scope.discussion.replies.push(reply);
        // clear body
        $scope.annotationBody = null;
        return;
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
