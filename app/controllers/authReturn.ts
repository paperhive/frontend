'use strict';
export default function(app) {
  app.controller('AuthReturnCtrl', [
    '$scope', '$routeParams', '$location', 'authService', 'notificationService',
    function($scope, $routeParams, $location, authService, notificationService) {
      authService
        .loginToken($routeParams.token)
        .then(
          function success(data) {
            $location.url($routeParams.returnPath);
            if ($routeParams.personCreated === 'true') {
              notificationService.notifications.push({
                type: 'info',
                message: 'Welcome to PaperHive! You can set your username ' +
                  '<a href="./settings" class="alert-link">here</a>.'
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
