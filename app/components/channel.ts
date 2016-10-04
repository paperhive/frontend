'use strict';

import { includes } from 'lodash';

import template from './channel.html';

export default function(app) {
  app.component('channel', {
    controller: ['$http', '$location', '$routeParams', '$uibModal', 'authService', 'config', 'notificationService',
      function($http, $location, $routeParams, $uibModal, authService, config, notificationService) {
        const ctrl = this;

        ctrl.$onChanges = changesObj => {
          authService.loginPromise.then(() => {
            $http.get(
              config.apiUrl + `/channels/${$routeParams.channelId}`
            )
            .success(ret => {
              ctrl.channel = ret;
              function findUser(member) {
                return member.person.id === authService.user.id;
              }
              const user = ret.members.find(findUser);
              ctrl.owner = includes(user.roles, 'owner');
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
      }
    ],

    template,
  });
};
