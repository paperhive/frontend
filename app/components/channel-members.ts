'use strict';

import template from './channel-members.html!text';

export default function(app) {
  app.component('channelMembers', {
    bindings: {},
    controller: [
    '$http', '$routeParams', 'authService', 'config', 'notificationService',
      function($http, $routeParams, authService, config, notificationService) {
        const ctrl = this;

        ctrl.$onChanges = changesObj => {
          authService.loginPromise.then(() => {
            $http.get(
              config.apiUrl + `/channels/${$routeParams.channelId}`
            )
            .success(ret => {
              ctrl.channel = ret;
            })
            .error(data => {
              notificationService.notifications.push({
                type: 'error',
                message: data.message ? data.message :
                  'could not fetch channel (unknown reason)'
              });
            });
          });
        };

      }
    ],
    template,
  });
};
