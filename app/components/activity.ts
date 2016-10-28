'use strict';

import template from './activity.html!text';

export default function(app) {
  app.component('activity', {
    bindings: {
      filterMode: '@',
      filterId: '<',
    },
    controller: [
    '$http', 'authService', 'config', 'notificationService',
      function($http, authService, config, notificationService) {
        const ctrl = this;
        ctrl.auth = authService;
        ctrl.$onChanges = changesObj => {
          ctrl.activities = undefined;
          ctrl.person = undefined;

          const params = {};
          switch (ctrl.filterMode) {
            case 'channel':
            case 'document':
            case 'person':
              // don't do anything if the filterId is falsy
              if (!ctrl.filterId) return;
              params[ctrl.filterMode] = ctrl.filterId;
              break;
            case undefined:
              break;
            default:
              throw new Error(`unknown filter mode ${ctrl.filterMode}`);
          }

          $http.get(`${config.apiUrl}/activities/`, {params})
            .then(
              response => ctrl.activities = response.data.activities,
              notificationService.httpError('could not fetch activities (unknown reason)')
            );

          // fetch person if person filter is active
          if (ctrl.filterMode === 'person') {
            $http.get(`${config.apiUrl}/people/${ctrl.filterId}`)
              .then(
                response => ctrl.person = response.data,
                notificationService.httpError('could not fetch person (unknown reason)')
              );
          }
        };
      }
    ],
    template,
  });
};
