'use strict';

import template from './template.html';

export default function(app) {
  app.component(
    'hivers', {
      template,
      bindings: {
        documentId: '<',
      },
      controller: [
        'config', '$http', 'notificationService',
        function(
          config, $http, notificationService
        ) {
          const ctrl = this;

          if (!ctrl.documentId) { return; }

          $http.get(
            config.apiUrl + '/documents/' + ctrl.documentId + '/hivers'
          )
          .success(function(data) {
            ctrl.hivers = data.hivers;
          })
          .error(function(err) {
            console.error(err);
            notificationService.notifications.push({
              type: 'error',
              message: err.data.message ? err.data.message :
                'could not fetch hivers (unknown reason)'
            });
          });
        }
      ]
    });
};
