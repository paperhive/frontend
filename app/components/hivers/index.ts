'use strict';

import template from './template.html!text';

export default function(app) {
  app.component(
    'hivers', {
      template,
      controller: [
        '$routeSegment', 'config', '$http', 'notificationService',
        function(
          $routeSegment, config, $http, notificationService
        ) {
          const ctrl = this;

          const documentId = $routeSegment.$routeParams.documentId;

          if (!documentId) { return; }

          $http.get(
            config.apiUrl + '/documents/' + documentId + '/hivers'
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
