'use strict';
module.exports = function(app) {
  app.controller('ContactCtrl', [
    '$scope', 'authService',
    function($scope, authService) {
      $scope.auth = authService;
    }
  ]);
};
