'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('signup', {
    template,
    controller: [
      '$scope', '$location', 'authService', '$http', 'config',
      function($scope, $location, authService, $http, config) {
        $scope.auth = authService;

        $scope.signup = {};

        $scope.hasError = function(field) {
          const form = $scope.signupForm;
          return (form.$submitted || form[field].$touched) &&
            form[field].$invalid;
        };

        $scope.hasErrorPassword = function() {
          const form = $scope.signupForm;
          return (form.$submitted || form['password'].$touched
            || !form['password'].$pristine) && form['password'].$invalid;
        };

        $scope.sendSignup = function() {
          $scope.signup.inProgress = true;
          $scope.signup.error = undefined;

          authService
          .signupEmail($scope.signup.email, $scope.signup.password)
          .then(function(response) {
            $scope.signup.inProgress = false;
            $scope.signup.succeeded = true;
          }, function(response) {
            $scope.signup.inProgress = false;
            $scope.signup.error = response.data && response.data.message ||
              'Unknown error';
          });
        };
      }
    ]
  });
};
