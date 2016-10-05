'use strict';

import { includes, remove } from 'lodash';

import template from './channel-members.html!text';

export default function(app) {
  app.component('channelMembers', {
    bindings: {
      channel: '<',
      isOwner: '<',
      onInvitationCreate: '&',
      onInvitationDelete: '&',
      onMemberUpdate: '&',
      onMemberDelete: '&',
    },
    controller: class ChannelMembers {
      static $inject = ['$scope', '$uibModal', 'authService'];
      constructor(public $scope, public $uibModal, public authService) {}

      invitationModalOpen() {
        this.$uibModal.open({
          component: 'channelInvitation',
          // TODO: remove this ugly hack when uibModal supports custom bindings
          scope: this.$scope,
        });
      };

      invitationDelete(invitationId) {
        this.invitationDeleting = invitationId;
        this.onInvitationDelete({invitationId})
          .then(() => this.invitationDeleting = false);
      }

      memberDelete(memberId) {
        this.memberDeleting = memberId;
        this.onMemberDelete({memberId})
          .then(() => this.memberDeleting = false);
      }
    },
    template,
  });
}
