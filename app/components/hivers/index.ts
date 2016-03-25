'use strict';

import template from './template.html!text';

export default function(app) {
  app.component(
    'hivers', {
      template,
      controller: [
        '$scope', '$routeSegment', 'config', '$http', 'notificationService',
        function(
          $scope, $routeSegment, config, $http, notificationService
        ) {
          const documentId = $routeSegment.$routeParams.documentId;

          if (!documentId) { return; }

          $http.get(
            config.apiUrl + '/documents/' + documentId + '/hivers'
          )
          .success(function(data) {
            $scope.hivers = data.hivers;
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
