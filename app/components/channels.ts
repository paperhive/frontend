'use strict';
import template from './channels.html';

export default function(app) {
  app.component('channels', {
    controller: ['$http', 'authService', 'config', 'notificationService',
      function($http, authService, config, notificationService) {
        const ctrl = this;
        ctrl.$onChanges = changesObj => {
          authService.loginPromise.then(() => {
            $http.get(
              config.apiUrl + '/channels'
            )
            .success(ret => {
              ctrl.channels = ret.channels;
            })
            .error(data => {
              notificationService.notifications.push({
                type: 'error',
                message: data.message ? data.message :
                  'could not fetch channels (unknown reason)'
              });
            });
          });
        };
      }
    ],
    template,
  });
};
