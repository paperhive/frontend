'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('activity', {
    bindings: {
      discussion: '<',
      document: '<',
      person: '<',
    },
    controller: [
    '$http', 'config', 'notificationService',
      function($http, config, notificationService) {
        const ctrl = this;
        ctrl.$onChanges = changesObj => {
          let personId;
          if (ctrl.user) {
            personId = ctrl.person.id;
          }
          $http.get(
            config.apiUrl + `/activities/`, {
              params: {
                document: ctrl.document,
                person: personId,
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
