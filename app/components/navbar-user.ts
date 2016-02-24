'use strict';

export default function(app) {
    app.component('navbarUser', {
      controller: [ '$scope', 'authService',
        function($scope, authService) {
          $scope.auth = authService;
        }],
      templateUrl: 'html/shared/navbar-user.html',
    });
};
