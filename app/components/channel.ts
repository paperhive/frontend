'use strict';

import { find, includes, remove } from 'lodash';

import template from './channel.html';

export default function(app) {
  app.component('channel', {
    controller: class ChannelCtrl {
      isOwner: boolean;

      static $inject = ['$routeParams', '$scope', 'authService', 'channelsApi'];
      constructor(public $routeParams, $scope, public authService, public channelsApi) {
        $scope.$watchCollection('$ctrl.channel.members', members => {
          if (!members) this.isOwner = false;
          const self = authService.user && find(members, {person: {id: authService.user.id}});
          this.isOwner = self && includes(self.roles, 'owner');
        });
      }

      $onChanges() {
        this.authService.loginPromise.then(() => {
          this.channelsApi.get(this.$routeParams.channelId)
            .then(channel => this.channel = channel);
        });
      };

      channelUpdate(channel) {
        return this.channelsApi.update(this.channel.id, channel)
          .then(newChannel => this.channel = newChannel);
      };

      channelActivate() {
        return this.channelsApi.activate(this.channel.id)
          .then(() => this.channel.isActive = true);
      };

      channelDeactivate() {
        return this.channelsApi.deactivate(this.channel.id)
          .then(() => this.channel.isActive = false);
      };

      invitationCreate(invitation) {
        return this.channelsApi.invitationCreate(this.channel.id, invitation)
          .then(newInvitation => this.channel.invitations.push(newInvitation));
      };

      invitationDelete(invitationId) {
        return this.channelsApi.invitationDelete(this.channel.id, invitationId)
          .then(() => remove(this.channel.invitations, {id: invitationId}));
      }

      memberUpdate(memberId, member) {
        return this.channelsApi.memberUpdate(this.channel.id, memberId, member)
          .then(channel => this.channel = channel);
      }

      memberDelete(memberId) {
        return this.channelsApi.memberDelete(this.channel.id, memberId)
          .then(() => remove(this.channel.members, {person: {id: memberId}}));
      }
    },
    template,
  });
};
