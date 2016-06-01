'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('activity', {
    bindings: {
      discussion: '<',
      document: '<',
      user: '<',
    },
    controller: [
    '$http', 'config', 'notificationService',
      function($http, config, notificationService) {
        const ctrl = this;
        ctrl.$onChanges = function(changesObj) {
          let personId;
          if (ctrl.user) {
            personId = ctrl.user.id;
          }
          $http.get(
            config.apiUrl + `/activities/`, {
              params: {
                document: ctrl.document,
                person: personId,
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
        };
      }
    ],
    template,
  });
};
