'use strict';
export default function(app) {
  app.controller('LoginCtrl', ['$scope', '$location', 'returnPathService',
    function($scope, $location, returnPathService) {

      $scope.returnPath = returnPathService;

      $scope.login = {
        email: '',
        password: ''
      };

      $scope.submit = function() {
        console.log($scope.login.email);
        console.log($scope.login.password);
      };

    }
  ]);
};
