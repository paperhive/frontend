'use strict';
import template from './channel-invitation.html';

export default function(app) {
  app.component('channelInvitation', {
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },

    controller: ['$http', 'authService', 'config',
      function($http, authService, config) {
        const ctrl = this;

        ctrl.ok = function () {
          ctrl.close();
        };

        ctrl.cancel = function () {
          ctrl.dismiss();
        };
      }
    ],

    template,
  });
};
