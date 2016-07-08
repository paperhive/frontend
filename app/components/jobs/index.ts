'use strict';

import template from './template.html';

export default function(app) {
  app.component(
    'jobs', {
      template,
      controller: [
        '$scope',
        function($scope) {
          $scope.jobsData = {
            toc: []
          };
        }]
    });
};
