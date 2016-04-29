'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('activity', {
    bindings: {
      document: '<',
    },
    controller: [
    '$http', 'config', 'notificationService',
      function($http, config, notificationService) {

        const ctrl = this;

        // TODO filter person="user.id", discussion
        // <activities person="user.id" ...></activities>

        $http.get(
          config.apiUrl + `/activities/`, {
            params: {
              document: ctrl.document,
            }
          }
        )
        .success(function(ret) {
          ctrl.activities = ret.activities;
        })
        .error(function(data) {
          notificationService.notifications.push({
            type: 'error',
            message: data.message ? data.message :
              'could not fetch activities (unknown reason)'
          });
        });

      }
    ],
    template,
  });
};
