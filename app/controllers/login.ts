'use strict';
export default function(app) {
  app.controller('LoginCtrl', ['$scope', '$location', 'authService', 'returnPathService',
    function($scope, $location, authService, returnPathService) {

      $scope.auth = authService;
      $scope.returnPath = returnPathService;

      $scope.login = {
        email: '',
        password: ''
      };

      $scope.hasError = function(field) {
        const form = $scope.loginForm;
        return (form.$submitted || form[field].$touched) &&
          form[field].$invalid;
      };

      $scope.$watch('email', function() {
        $scope.emailError = undefined;
      });

      $scope.$watch('password', function() {
        $scope.passwordError = undefined;
      });

      $scope.login = function() {
        console.log($scope.login.email);
        console.log($scope.login.password);
        $location.path($scope.returnPath.returnPath);
      };

    }
  ]);
};
