'use strict';
export default function(app) {
  app.controller('PasswordRequestCtrl', ['$scope', '$location',
    function($scope, $location) {

      $scope.form = {
        email: undefined
      };

      if ($location.search().email) {
        $scope.form.email = $location.search().email;
      }

      // TODO
      $scope.sendResetMail = function() {
        console.log($scope.form.email);
        // TODO set correct path to password reset page
        $location.path('/login');
      };

    }
  ]);
};
