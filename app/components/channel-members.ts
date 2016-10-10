'use strict';

import { includes, remove } from 'lodash';

import template from './channel-members.html!text';

export default function(app) {
  app.component('channelMembers', {
    bindings: {
      channel: '<',
      isOwner: '<',
    },
    controller: class ChannelMembers {
      static $inject = ['$scope', '$uibModal', 'authService', 'channelService'];
      constructor(public $scope, public $uibModal, public authService, public channelService) {}

      invitationModalOpen() {
        this.$uibModal.open({
          component: 'channelInvitation',
          // TODO: remove this ugly hack when uibModal supports custom bindings
          scope: this.$scope,
        });
      };

      invitationDelete(channelId, invitationId) {
        this.invitationDeleting = invitationId;
        this.channelService.invitationDelete(channelId, invitationId)
          .finally(() => this.invitationDeleting = false);
      }

      memberDelete(channel, memberId) {
        this.memberDeleting = memberId;
        this.channelService.memberDelete(channel, memberId)
          .finally(() => this.memberDeleting = false);
      }
    },
    template,
  });
}
