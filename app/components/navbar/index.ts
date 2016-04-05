'use strict';

import template from './template.html!text';

export default function(app) {
  app.component(
    'navbar', {
      template,
      controller : ['$scope', 'tourService', '$window', function($scope, tourService, $window) {
        $scope.collapsed = true;

        $scope.tour = tourService;

        // ask local storage if flag 'tourVisited' is already set
        if ($window.localStorage.tourVisited) {
          $scope.tourVisited = true;
        }

      }]
    });
};
