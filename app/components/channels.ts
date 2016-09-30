'use strict';

import template from './channels.html';

export default function(app) {
  app.component(
    'channels', {
      template,
      controller: [
        '$scope',
        function($scope) {
          $scope.channels = {
            toc: []
          };
        }]
    });
};
