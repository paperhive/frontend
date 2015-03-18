'use strict';
module.exports = function(app) {

  app.controller('CommentCtrl', [
    '$scope', '$location', '$routeSegment',
    function($scope, $location, $routeSegment) {
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
    }]);
};
