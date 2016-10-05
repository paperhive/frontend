'use strict';
import template from './channel-invitation.html';

export default function(app) {
  app.component('channelInvitation', {
    bindings: {
      close: '&',
      dismiss: '&'
    },

    controller: ['$http', '$routeParams', '$scope', 'authService', 'config', 'notificationService',
      function($http, $routeParams, $scope, authService, config, notificationService) {
        const ctrl = this;

        ctrl.roles = [
          {'id': 1, 'name': 'member'},
          {'id': 2, 'name': 'owner'},
        ];

        ctrl.hasError = (field) => {
          const form = $scope.invitationForm;
          return form && (form.$submitted || form[field].$touched) &&
            form[field].$invalid;
        };

        ctrl.submit = (email, role) => {
          ctrl.close();
          ctrl.inProgress = true;
          ctrl.error = undefined;
          $http.post(
            config.apiUrl + `/channels/${$routeParams.channelId}/invitations`,
              {email, roles: [ctrl.roles[role - 1].name]},
          )
          .success(ret => {
            ctrl.inProgress = false;
            ctrl.succeeded = true;
            ctrl.invitation = ret;
          })
          .error(data => {
            ctrl.inProgress = false;
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
