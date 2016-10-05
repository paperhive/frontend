'use strict';

import { find, includes } from 'lodash';

import template from './channel.html';

export default function(app) {
  app.component('channel', {
    controller: ['$routeParams', '$scope', 'authService', 'channelsApi',
      function($routeParams, $scope, authService, channelsApi) {
        const $ctrl = this;

        $ctrl.$onChanges = changesObj => {
          authService.loginPromise.then(() => {
            channelsApi.get($routeParams.channelId)
              .then(channel => $ctrl.channel = channel);
          });
        };

        $scope.$watchCollection('$ctrl.channel.members', members => {
          if (!members) $ctrl.owner = false;
          const self = authService.user && find(members, {person: {id: authService.user.id}});
          $ctrl.owner = self && includes(self.roles, 'owner');
        });

        $ctrl.channelUpdate = (channelId, channel) => {
          return channelsApi.update(channelId, channel)
            .then(channel => $ctrl.channel = channel);
        };

        $ctrl.channelActivate = (channelId) => {
          return channelsApi.activate(channelId)
            .then(() => $ctrl.channel.isActive = true);
        };

        $ctrl.channelDeactivate = (channelId) => {
          return channelsApi.deactivate(channelId)
            .then(() => $ctrl.channel.isActive = false);
        };
      }
    ],
    template,
  });
};
