module.exports = function (app) {
  app.controller('UserArticlesCtrl', [
    '$scope', '$routeSegment', 'config', '$http', 'NotificationsService',
    'authService',
    function ($scope, $routeSegment, config, $http, notificationsService) {
      $http.get(
        config.api_url + '/users/' + $scope.user._id + '/importedArticles'
      ).
        success(function (articles) {
          $scope.articles = articles;
        }).
        error(function (data) {
          notificationsService.notifications.push({
            type: 'error',
            message: data.message
          });
        });
    }
  ]);
};
