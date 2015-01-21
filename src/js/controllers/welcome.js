module.exports = function (app) {
  app.controller('WelcomeCtrl', [
    '$scope', 'authService',
    function($scope, authService) {
      $scope.auth = authService;
    }
  ]);
};

