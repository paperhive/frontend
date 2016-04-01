'use strict';

import template from './template.html!text';

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
