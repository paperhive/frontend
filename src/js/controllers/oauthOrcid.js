module.exports = function (app) {
  app.controller('OauthOrcidCtrl', ['$scope', '$routeParams', 'AuthService',
    function ($scope, $routeParams, authService) {
      authService.signinOrcid($routeParams.code, $routeParams.state);
      $scope.auth = authService;
    }
  ]);
};
