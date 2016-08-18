'use strict';

import template from './notifications.html';

export default function(app) {
  app.component(
    'notifications', {
      template,
      controller: ['$scope', 'notificationService',
        function($scope, notificationService) {
          $scope.notifications = notificationService.notifications;
          $scope.close = function(index) {
            notificationService.notifications.splice(index, 1);
          };
          $scope.types = {
            'error': 'danger',
            'info': 'info',
            'warning': 'warning',
            'success': 'success'
          };
        }
      ]
    });
};
