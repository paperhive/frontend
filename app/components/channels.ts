'use strict';
import template from './channels.html';

export default function(app) {
  app.component('channels', {
    controller: ['$location', 'authService', 'channelsApi',
      function($location, authService, channelsApi) {
        const ctrl = this;
        ctrl.$onChanges = changesObj => {
          authService.loginPromise.then(() => {
            channelsApi.getAll().then(channels => ctrl.channels = channels);
          });
        };

        ctrl.openChannel = (id) => {
          $location.path(`/channels/${id}`);
        };
      }
    ],
    template,
  });
};
