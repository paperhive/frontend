'use strict';

import template from './template.html!text';

export default function(app) {
  app.component(
    'navbar', {
      template,
      controller : ['$scope', function($scope) {
        $scope.collapsed = true;
      }]
    });
};
