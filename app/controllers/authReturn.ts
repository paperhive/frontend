'use strict';
export default function(app) {
  app.controller('AuthReturnCtrl', [
    '$scope', '$routeParams', '$location', 'authService', 'notificationService',
    function($scope, $routeParams, $location, authService, notificationService) {
      authService
        .loginToken($routeParams.token)
        .then(
          function success(data) {
            $location.path($routeParams.returnPath).search({});
            if ($routeParams.personCreated === "true") {
              notificationService.notifications.push({
                type: 'info',
                message: 'Welcome at PaperHive! Change your settings here'
              });
            }
          },
          function fail(reason) {
            $scope.error = reason;
          }
        );
      $scope.auth = authService;
    }
  ]);
};
