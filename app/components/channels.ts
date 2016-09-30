'use strict';

import template from './channels.html!text';

export default function(app) {
  app.component('channels', {
    controller: ['$http', 'authService', 'config', 'notificationService',
      function($http, authService, config, notificationService) {
        const ctrl = this;
        ctrl.auth = authService;
        ctrl.$onChanges = changesObj => {
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
                'could not fetch activities (unknown reason)'
            });
          });
        };
      }
    ],
    template,
  });
};
