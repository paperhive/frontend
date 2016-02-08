'use strict';
export default function(app) {
  app.controller('NavbarUserCtrl', ['$scope', 'authService', 'returnPathService',
    function($scope, authService, returnPathService) {
      $scope.auth = authService;
      $scope.returnPath = returnPathService;
    }
  ]);
};
