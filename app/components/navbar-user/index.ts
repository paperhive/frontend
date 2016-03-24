'use strict';

import template from './template.html!text';

export default function(app) {
    app.component('navbarUser', {
      controller: [ '$scope', 'authService', 'tourService', '$window',
        function($scope, authService, tourService, $window) {

          $scope.auth = authService;
          $scope.tour = tourService;

        }],
      template,
    });
};
