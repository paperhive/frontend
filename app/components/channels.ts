'use strict';
import template from './channels.html';

export default function(app) {
  app.component('channels', {
    controller: ['$location', 'authService', 'channelService',
      function($location, authService, channelService) {
        const ctrl = this;
        ctrl.$onChanges = changesObj => {
          authService.loginPromise.then(() => {
            channelService.getAll().then(channels => ctrl.channels = channels);
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
