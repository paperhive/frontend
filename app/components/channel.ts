'use strict';
import template from './channel.html';

export default function(app) {
  app.component('channel', {
    controller: ['$http', '$location', '$routeParams', 'authService', 'config', 'notificationService',
      function($http, $location, $routeParams, authService, config, notificationService) {
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

        ctrl.deactivateChannel = (id) => {
          $http.delete(
            config.apiUrl + `/channels/${id}/active`
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

        ctrl.activateChannel = (id) => {
          $http.post(
            config.apiUrl + `/channels/${id}/active`
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
