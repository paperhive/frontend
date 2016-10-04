'use strict';

import { remove } from 'lodash';

import template from './channel-members.html!text';

export default function(app) {
  app.component('channelMembers', {
    bindings: {},
    controller: [
    '$http', '$routeParams', '$uibModal', 'authService', 'config', 'notificationService',
      function($http, $routeParams, $uibModal, authService, config, notificationService) {
        const ctrl = this;

        ctrl.$onChanges = changesObj => {
          authService.loginPromise.then(() => {
            $http.get(
              config.apiUrl + `/channels/${$routeParams.channelId}`
            )
            .success(ret => {
              ctrl.channel = ret;
            })
            .error(data => {
              notificationService.notifications.push({
                type: 'error',
                message: data.message ? data.message :
                  'could not fetch channel (unknown reason)'
              });
            });
          });
        };

        ctrl.open = () => {
          const modalInstance = $uibModal.open({
            animation: ctrl.animationsEnabled,
            component: 'channelInvitation',
          });
        };

        ctrl.toggleAnimation = () => {
          ctrl.animationsEnabled = !ctrl.animationsEnabled;
        };

        ctrl.deleteChannelInvitation = (channelId, invitationId) => {
          $http.delete(
            config.apiUrl + `/channels/${channelId}/invitations/${invitationId}`
          )
          .success(ret => {
            remove(ctrl.channel.invitations, {id: invitationId});
          })
          .error(data => {
            notificationService.notifications.push({
              type: 'error',
              message: data.message ? data.message :
                'could not delete channel invitation (unknown reason)'
            });
          });
        };

      }
    ],
    template,
  });
};
