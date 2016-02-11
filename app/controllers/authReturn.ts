'use strict';
export default function(app) {
  app.controller('AuthReturnCtrl', [
    '$scope', '$routeParams', '$location', 'authService',
    function($scope, $routeParams, $location, authService) {
      authService
        .loginToken($routeParams.token)
        .then(
          function success(data) {
            $location.path($routeParams.returnPath).search({});
          },
          function fail(reason) {
            $scope.error = reason;
          }
        );
      $scope.auth = authService;
    }
  ]);
};
