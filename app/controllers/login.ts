'use strict';
export default function(app) {
  app.controller('LoginCtrl', ['$scope', '$location', 'authService', 'returnPathService', '$http', 'config',
    function($scope, $location, authService, returnPathService, $http, config) {

      $scope.auth = authService;
      $scope.returnPath = returnPathService;

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
      });

      $scope.$watch('password', function() {
        $scope.passwordError = undefined;
      });

      $scope.login = function() {
        $scope.subscribing = true;
        $scope.passwordError = undefined;
        $scope.emailError = undefined;
        $scope.responseError = undefined;

        $http.post(config.apiUrl + '/auth/signin/email', {
          emailOrUsername: $scope.login.emailOrUsername,
          password: $scope.login.password
        }).then(function(response) {
            $scope.subscribing = false;
            $scope.subscribed = true;
            $location.path($scope.returnPath.returnPath);
          }, function(response) {
            $scope.subscribing = false;
            $scope.responseError = response.data && response.data.message ||
              'Unknown error';
          });
      };

      $scope.getNewPasswd = function() {
      };

    }
  ]);
};
