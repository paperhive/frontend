'use strict';
export default function(app) {
  app.controller('NavbarUserCtrl', ['$scope', 'authService',
    function($scope, authService) {
      $scope.auth = authService;
    }
  ]);
};
