'use strict';
module.exports = function (app) {
  app.controller('NavbarUserCtrl', ['$scope', 'authService',
    function ($scope, authService) {
      $scope.auth = authService;
    }
  ]);
};
