'use strict';
module.exports = function(app) {

  app.controller('CommentCtrl', [
    '$scope', '$location', '$routeSegment', '$http', 'config',
    function($scope, $location, $routeSegment, $http, config) {
      $scope.save = function() {
        $scope.submitting = true;
        var promise = $scope.addDiscussion($scope.comment);
        if (promise) {
          promise.success(function(data) {
            $location.path($routeSegment.getSegmentUrl(
              'articles.discussions.thread',
              {
                articleId: $routeSegment.$routeParams.articleId,
                discussionIndex: data.index
              }
            ));
          })
          .finally(function() {
            $scope.submitting = false;
          });
        }
      };

      $scope.searchUsers = function(query, limit) {
        if (!query) {return;}
        $http.get(config.apiUrl + '/users/', {
          params: {q: query, limit: limit}
        })
        .then(function(response) {
          $scope.foundUsers = response.data;
        });
      };

      $scope.getMentioText = function(user) {
        return '@' + user.username;
      };

    }]);
};
