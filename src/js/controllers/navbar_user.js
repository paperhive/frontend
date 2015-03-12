module.exports = function (app) {
  'use strict';

  app.controller('NavbarUserCtrl', ['$scope', 'authService',
    function ($scope, authService) {
      $scope.auth = authService;
    }
  ]);
};
