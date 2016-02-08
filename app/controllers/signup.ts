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

      $scope.submit = function() {
        console.log($scope.login.email);
        console.log($scope.login.password);
        $location.path($scope.returnPath.returnPath);
      };

    }
  ]);
};