'use strict';

import template from './template.html!text';

export default function(app) {
  app.component(
    'navbar', {
      template,
      controller : ['$scope', 'tourService', function($scope, tourService) {
        $scope.collapsed = true;

        $scope.tour = tourService;

      }]
    });
};
