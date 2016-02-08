'use strict';
export default function(app) {
  app.controller('SignupCtrl', ['$scope', '$location', 'authService', 'returnPathService',
    function($scope, $location, authService, returnPathService) {

      $scope.auth = authService;
      $scope.returnPath = returnPathService;

      $scope.signup = {
        email: '',
        password: ''
      };

      $scope.signup = function() {
        console.log($scope.signup.email);
        console.log($scope.signup.password);
        $location.path($scope.returnPath.returnPath);
      };

    }
  ]);
};