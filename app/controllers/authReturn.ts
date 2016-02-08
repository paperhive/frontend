'use strict';
export default function(app) {
  app.controller('AuthReturnCtrl', [
    '$scope', '$routeParams', '$location', 'authService',
    function($scope, $routeParams, $location, authService) {
      authService
        .signinToken($routeParams.token)
        .then(
          function success(data) {
            $location.path('/welcome').search({});
          },
          function fail(reason) {
            $scope.error = reason;
          }
        );
      $scope.auth = authService;
    }
  ]);
};
