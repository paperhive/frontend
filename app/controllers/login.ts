'use strict';
export default function(app) {
  app.controller('LoginCtrl', ['$scope', '$location',
    function($scope, $location) {

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
