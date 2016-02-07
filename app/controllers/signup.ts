'use strict';
export default function(app) {
  app.controller('SignupCtrl', ['$scope', '$location',
    function($scope, $location) {

      $scope.signup = {
        email: '',
        password: ''
      };

      $scope.submit = function() {
        console.log($scope.signup.email);
        console.log($scope.signup.password);
      };

    }
  ]);
};