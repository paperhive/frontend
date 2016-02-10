'use strict';
export default function(app) {
  app.controller('LoginCtrl', ['$scope', '$location', 'authService', '$http', 'config',
    function($scope, $location, authService, $http, config) {

      $scope.auth = authService;

      $scope.login = {
        emailOrUsername: '',
        password: ''
      };

      $scope.hasError = function(field) {
        const form = $scope.loginForm;
        return (form.$submitted || form[field].$touched) &&
          form[field].$invalid;
      };

      $scope.$watch('emailOrUsername', function() {
        $scope.emailError = undefined;
        $scope.responseError = undefined;
      });

      $scope.$watch('password', function() {
        $scope.passwordError = undefined;
        $scope.responseError = undefined;
      });

      $scope.login = function() {
        $scope.subscribing = true;
        $scope.passwordError = undefined;
        $scope.emailError = undefined;
        $scope.responseError = undefined;

        authService
          .loginEmail(
            $scope.login.emailOrUsername, $scope.login.password
          )
          .then(function(data) {
            $scope.subscribing = false;
            $scope.subscribed = true;
            $location.path(authService.returnPath).search({});
          }, function(data) {
            $scope.subscribing = false;
            $scope.responseError = data && data.message || 'Unknown error';
          });
      };

      $scope.getNewPasswd = function() {
      };

    }
  ]);
};
