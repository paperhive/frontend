module.exports = function (app) {
  'use strict';

  app.controller('OauthOrcidCtrl', [
    '$scope', '$routeParams', '$location', 'authService',
    function ($scope, $routeParams, $location, authService) {
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
