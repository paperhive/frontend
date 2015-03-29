'use strict';
module.exports = function(app) {
  app.controller('UserCtrl', [
    '$scope', '$rootScope', '$routeSegment', 'config', '$http',
    'notificationService', 'authService', 'metaService',
    function(
      $scope, $rootScope, $routeSegment, config, $http,
      notificationService, authService, metaService
    ) {
      // expose $routeSegment for subnav
      $scope.$routeSegment = $routeSegment;

      // expose auth for checking if this is the user's own profile
      $scope.auth = authService;

      // fetch user
      $http.get(config.apiUrl + '/users/byUsername/' +
                $routeSegment.$routeParams.username)
        .success(function(data) {
          $scope.user = data;
          metaService.title = data.username + ' (' + data.displayName + ')';
          metaService.author = undefined;
          metaService.description = undefined;
          metaService.keywords = undefined;
        })
        .error(function(data) {
          notificationService.notifications.push({
            type: 'error',
            message: data.message
          });
        });
    }
  ]);
};
