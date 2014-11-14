module.exports = function (app) {
  app.controller('UserCtrl', ['$scope', 'config', 'AuthService',
    function ($scope, config, authService) {
      $scope.config = config;
      $scope.auth = authService;
    }
  ]);
};
