'use strict';
module.exports = function(app) {

  app.controller('CommentCtrl', [
    '$scope', '$location', '$routeSegment', '$http', 'config',
    'notificationService',
    function(
      $scope, $location, $routeSegment, $http, config,
      notificationService
    ) {
      $scope.save = function() {
        $scope.submitting = true;
        var promise = $scope.addDiscussion($scope.comment);
        if (promise) {
          promise.success(function(data) {
            $location.path($routeSegment.getSegmentUrl(
              'articles.discussions.thread',
              {
                articleId: $routeSegment.$routeParams.articleId,
                discussionId: data.id
              }
            ));
          })
          .finally(function() {
            $scope.submitting = false;
          });
        }
      };

      $scope.searchUsers = function(query, limit) {
        if (!query) {
          $scope.foundUsers = [];
          return;
        }
        $http.get(config.apiUrl + '/users/', {
          params: {q: query, limit: limit}
        })
        .success(function(response) {
          $scope.foundUsers = response.data;
        })
        .error(notificationService.httpError('could not fetch users'));

      };

      $scope.getMentioText = function(user) {
        return '@' + user.username;
      };

    }]);
};
