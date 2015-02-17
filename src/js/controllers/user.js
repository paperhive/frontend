module.exports = function (app) {
  app.controller('UserCtrl', [
    '$scope', '$routeSegment', 'config', '$http', 'NotificationsService',
    function ($scope, $routeSegment, config, $http, notificationsService) {
      // expose $routeSegment for subnav
      $scope.$routeSegment = $routeSegment;

      // fetch user
      $http.get(config.api_url + '/users/byUsername/' + $routeSegment.$routeParams.username)
        .success(function (data) {
          $scope.user = data;
        })
        .error(function (data) {
          notificationsService.notifications.push({
            type: 'error',
            message: data.message
          });
        });
    }
  ]);
};
