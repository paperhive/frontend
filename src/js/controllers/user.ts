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
      $http.get(
        config.apiUrl + '/people/username/' +
                $routeSegment.$routeParams.username
      )
        .success(function(data) {
          $scope.user = data;
          metaService.set({
            title: data.user.username + ' (' + data.displayName + ')' +
              ' · PaperHive',
            meta: [{
              name: 'description',
              content: 'Profile of ' + data.user.username +
                ' (' + data.displayName + ')' +
                  ' on PaperHive.'
            }]
          });
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
