module.exports = function (app) {
  'use strict';

  app.controller('UserArticlesCtrl', [
    '$scope', '$routeSegment', 'config', '$http', 'notificationService',
    'authService',
    function ($scope, $routeSegment, config, $http, notificationService) {
      $http.get(
        config.api_url + '/users/' + $scope.user._id + '/importedArticles'
      ).
        success(function (articles) {
          $scope.articles = articles;
        }).
        error(function (data) {
          notificationService.notifications.push({
            type: 'error',
            message: data.message
          });
        });
    }
  ]);
};
