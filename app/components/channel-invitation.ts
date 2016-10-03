'use strict';
import template from './channel-invitation.html';

export default function(app) {
  app.component('channelInvitation', {
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },

    controller: ['$http', '$routeParams', 'authService', 'config', 'notificationService',
      function($http, $routeParams, authService, config, notificationService) {
        const ctrl = this;

        ctrl.roles = [
          {'id': 1, 'name': 'member'},
          {'id': 2, 'name': 'owner'},
        ];

        ctrl.ok = (email, role) => {
          ctrl.close();

          $http.post(
            config.apiUrl + `/channels/${$routeParams.channelId}/invitations`,
	            {email, roles: [ctrl.roles[role-1].name]},
          )
          .success(ret => {
            console.log(ret);
            ctrl.invitation = ret;
          })
          .error(data => {
            notificationService.notifications.push({
              type: 'error',
              message: data.message ? data.message :
                'invitation failed (unknown reason)'
            });
          });
        };

        ctrl.cancel = () => {
          ctrl.dismiss();
        };
      }
    ],

    template,
  });
};
