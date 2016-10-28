'use strict';

import { find, includes } from 'lodash';

import template from './channel.html';

export default function(app) {
  app.component('channel', {
    controller: class ChannelCtrl {
      isOwner: boolean;

      static $inject = ['$routeParams', '$scope', '$uibModal', 'authService', 'channelService'];
      constructor(public $routeParams, public $scope, public $uibModal, public authService, public channelService) {
        $scope.$watchCollection('$ctrl.channel.members', members => {
          if (!members) this.isOwner = false;
          const self = authService.user && find(members, {person: {id: authService.user.id}});
          this.isOwner = self && includes(self.roles, 'owner');
        });

        $scope.$watch(
          () => channelService.get($routeParams.channelId),
          channel => this.channel = channel
        );
      }

      invitationModalOpen() {
        this.$uibModal.open({
          component: 'channelInvitation',
          resolve: {
            channelId: () => this.$routeParams.channelId,
          },
        });
      };

    },
    template,
  });
};
