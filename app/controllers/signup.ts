'use strict';
export default function(app) {
  app.controller('SignupCtrl', ['$scope', '$location', 'authService', 'returnPathService', '$http', 'config',
    function($scope, $location, authService, returnPathService, $http, config) {

      $scope.auth = authService;
      $scope.returnPath = returnPathService;

      $scope.signup = {
        email: '',
        password: ''
      };

      $scope.hasError = function(field) {
        const form = $scope.signupForm;
        return (form.$submitted || form[field].$touched) &&
          form[field].$invalid;
      };

      $scope.$watch('email', function() {
        $scope.emailError = undefined;
      });

      $scope.$watch('password', function() {
        $scope.passwordError = undefined;
      });

      $scope.signup = function() {
        $scope.subscribing = true;
        $scope.passwordError = undefined;
        $scope.emailError = undefined;

        $scope.subscribed = true;

        /*$http.post(config.apiUrl + '/auth/email/initiate/', {
          email: $scope.signup.email,
          password: $scope.signup.password,
          returnUrl: $scope.returnPath.returnPath
          }).then(function(response) {
            $scope.subscribing = false;
            $scope.subscribed = true;
          }, function(response) {
            $scope.subscribing = false;
            // TODO check
            $scope.passwordError = response.data && response.data.message ||
              'Unknown error';
            $scope.emailError = response.data && response.data.message ||
              'Unknown error';
          });
*/
      };

    }
  ]);
};