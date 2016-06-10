'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('activity', {
    bindings: {
      document: '<',
      person: '<',
    },
    controller: [
    '$http', 'authService', 'config', 'notificationService',
      function($http, authService, config, notificationService) {
        const ctrl = this;
        ctrl.auth = authService;
        ctrl.$onChanges = changesObj => {
          $http.get(
            config.apiUrl + `/activities/`, {
              params: {
                document: ctrl.document,
                person: ctrl.person,
              }
            }
          )
          .success(ret => {
            ctrl.activities = ret.activities;
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
