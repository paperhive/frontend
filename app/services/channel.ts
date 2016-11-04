import angular from 'angular';
import { find, remove } from 'lodash';

export default function(app) {
  app.service('channelService', class channelService {
    channels: Array<any>;
    invitations: Array<any>;
    channelsById: any;
    selectedChannel: any;
    showAllChannels = true;

    static $inject = ['$rootScope', 'authService', 'channelsApi'];
    constructor($rootScope, public authService, public channelsApi) {
      $rootScope.$watch(() => authService.user, user => {
        if (!user) {
          this.channels = undefined;
          this.invitations = undefined;
          this.channelsById = undefined;
          return;
        }
        this.refresh();
      });
    }

    refresh() {
      this.channelsApi.getAll().then(data => {
        this.channels = data.channels;
        this.invitations = data.invitations.filter(invitation => invitation.channel.isActive);
        this.channelsById = {};
        this.channels.forEach(channel => {
          this.channelsById[channel.id] = channel;
        });
      });
    }

    create(obj) {
      return this.channelsApi.create(obj)
        .then(channel => {
          this.channels.push(channel);
          return channel;
        });
    }

    get(id) {
      return find(this.channels, {id});
    }

    update(id, obj) {
      return this.channelsApi.update(id, obj)
        .then(newChannel => angular.copy(newChannel, this.get(id)));
    }

    activate(id) {
      return this.channelsApi.activate(id)
        .then(() => this.get(id).isActive = true);
    }

    deactivate(id) {
      return this.channelsApi.deactivate(id)
        .then(() => this.get(id).isActive = false);
    }

    invitationCreate(id, invitation) {
      return this.channelsApi.invitationCreate(id, invitation)
        .then(newInvitation => this.get(id).invitations.push(newInvitation));
    }

    invitationConfirm(id, invitationId, token, password) {
      if (token) {
        return this.channelsApi.invitationConfirm(id, invitationId, token, password)
          .then(data => this.invitations = data);
      }
      return this.channelsApi.invitationConfirm(id, invitationId)
        .then(invitation => {
          this.channels.push(invitation.channel);
          remove(this.invitations, {id: invitationId});
        });
    }

    invitationDelete(id, invitationId, token) {
      if (token) {
        return this.channelsApi.invitationDelete(id, invitationId, token);
      }
      return this.channelsApi.invitationDelete(id, invitationId)
        .then(() => {
          const channel = this.get(id);
          if (channel) remove(channel.invitations, {id: invitationId});
          else remove(this.invitations, {id: invitationId});
        });
    }

    memberUpdate(channelId, memberId, member) {
      return this.channelsApi.memberUpdate(channelId, memberId, member)
        .then(newChannel => angular.copy(newChannel, this.get(channelId)));
    }

    memberDelete(channel, memberId) {
      return this.channelsApi.memberDelete(channel.id, memberId)
        .then(() => remove(channel.members, {person: {id: memberId}}));
    }

    selectChannel(channel) {
      this.selectedChannel = channel;
    }

    toggleShowAllChannels() {
      this.showAllChannels = !this.showAllChannels;
    }

    getDescription(channel) {
      if (!channel) return 'Public channel';
      return channel.name;
    }
  });
}
