'use strict';

import template from './template.html!text';

export default function(app) {
  app.component(
    'navbar', {
      template,
      controller : ['$routeSegment', '$scope', '$window', 'tourService',
          function($routeSegment, $scope, $window, tourService) {
        $scope.collapsed = true;

        $scope.tour = tourService;
        $scope.$routeSegment = $routeSegment;

        // ask local storage if flag 'tourVisited' is already set
        if ($window.localStorage.tourVisited) {
          $scope.tourVisited = true;
        }

      }]
    });
};
