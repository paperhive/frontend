module.exports = function (app) {
  'use strict';

  app.controller('WelcomeCtrl', [
    '$scope', 'authService',
    function($scope, authService) {
      $scope.auth = authService;
    }
  ]);
};

