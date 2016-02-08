'use strict';
export default function(app) {
  app.controller('SignupCtrl', ['$scope', '$location', 'returnPathService',
    function($scope, $location, returnPathService) {

      $scope.returnPath = returnPathService;

      $scope.signup = {
        email: '',
        password: ''
      };

      $scope.submit = function() {
        console.log($scope.signup.email);
        console.log($scope.signup.password);
        $location.path('/');
      };

    }
  ]);
};