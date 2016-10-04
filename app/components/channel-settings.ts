'use strict';

import template from './channel-settings.html!text';

export default function(app) {
  app.component('channelSettings', {
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

        ctrl.save = (name, description) => {
          $http.put(
            config.apiUrl + `/channels/${$routeParams.channelId}`,
            {name, description},
          )
          .success(ret => {
            ctrl.channel = ret;
          })
          .error(data => {
            notificationService.notifications.push({
              type: 'error',
              message: data.message ? data.message :
                'update failed (unknown reason)'
            });
          });
        };

        // deactivate
        ctrl.deactivate = () => {
          $http.delete(
            config.apiUrl + `/channels/${$routeParams.channelId}/active`
          )
          .success(ret => {
            ctrl.channel = ret;
          })
          .error(data => {
            notificationService.notifications.push({
              type: 'error',
              message: data.message ? data.message :
                'could not deactivate channel (unknown reason)'
            });
          });
        };

        // activate
        ctrl.activate = () => {
          $http.post(
            config.apiUrl + `/channels/${$routeParams.channelId}/active`
          )
          .success(ret => {
            ctrl.channel = ret;
          })
          .error(data => {
            notificationService.notifications.push({
              type: 'error',
              message: data.message ? data.message :
                'could not activate channel (unknown reason)'
            });
          });
        };

      }
    ],
    template,
  });
};
