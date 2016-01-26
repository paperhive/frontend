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
      console.log(1211);
      console.log($routeSegment.$routeParams.username);
      $http.get(
        config.apiUrl + '/people/username/' +
                $routeSegment.$routeParams.username
      )
        .success(function(data) {
          // Yikes! normally, we'd want to get the data for the user
          // immediately. Restrictions in the backend however only make it
          // possible to return the person ID in the body, so we're bound to
          // make another request... :(
          console.log('data1', data);
          $http.get(config.apiUrl + '/people/' + data.personId)
          .success(function(data) {
            console.log('data2', data);
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
