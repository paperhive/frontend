module.exports = function (app) {
  'use strict';

  app.controller('UserCtrl', [
    '$scope', '$routeSegment', 'config', '$http', 'notificationService',
    'authService',
    function ($scope, $routeSegment, config, $http, notificationService,
              authService) {
      // expose $routeSegment for subnav
      $scope.$routeSegment = $routeSegment;

      // expose auth for checking if this is the user's own profile
      $scope.auth = authService;

      // fetch user
      $http.get(config.api_url + '/users/byUsername/' + $routeSegment.$routeParams.username)
        .success(function (data) {
          $scope.user = data;
        })
        .error(function (data) {
          notificationService.notifications.push({
            type: 'error',
            message: data.message
          });
        });
    }
  ]);
};
