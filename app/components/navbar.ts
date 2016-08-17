'use strict';

import template from './navbar.html';

export default function(app) {
  app.component(
    'navbar', {
      template,
      controller : ['$routeSegment', '$scope', 'tourService',
          function($routeSegment, $scope, tourService) {
        $scope.collapsed = true;

        $scope.tour = tourService;
        $scope.$routeSegment = $routeSegment;
      }]
    });
};
