'use strict';

import template from './template.html!text';

export default function(app) {
  app.component(
    'userProfile', {
      template,
      bindings: {
        'user': '<',
      },
      controller: [
        '$scope', '$http', 'config', 'notificationService',
        function($scope, $http, config, notificationService) {
          const ctrl = this;
          $scope.$watch('$ctrl.user.id', async function(id) {
            if (!id) { return; }
            try {
              const ret = await $http({
                method: 'GET',
                url: config.apiUrl + '/discussions',
                params: {
                  author: id,
                  populateDocumentRevision: true,
                }
              });
              ctrl.discussions = ret.data.discussions;
            } catch (err) {
              notificationService.notifications.push({
                type: 'error',
                message: err.data.message ? err.data.message :
                  'could not fetch hived documents (unknown reason)'
              });
            }
            // This is an async function, so unless we $apply, angular won't
            // know that values have changed.
            $scope.$apply();
          });
        }
      ]
    });
};
