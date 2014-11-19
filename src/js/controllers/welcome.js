module.exports = function (app) {
  app.controller('WelcomeCtrl', [
    '$scope', 'AuthService',
    function($scope, authService) {
      $scope.auth = authService;
    }
  ]);
};

