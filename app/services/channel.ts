import angular from 'angular';
import { remove } from 'lodash';


export default function(app) {
  app.service('channelService', class channelService {
    static $inject = ['channelsApi'];
    constructor(public channelsApi) {}

    create(obj) {
      return this.channelsApi.create(obj);
    }

    get(id) {
      return this.channelsApi.get(id);
    }

    getAll() {
      return this.channelsApi.getAll();
    }

    update(channel, obj) {
      return this.channelsApi.update(channel.id, obj)
        .then(newChannel => angular.copy(newChannel, channel));
    }

    activate(channel) {
      return this.channelsApi.activate(channel.id)
        .then(() => channel.isActive = true);
    };

    deactivate(channel) {
      return this.channelsApi.deactivate(channel.id)
        .then(() => channel.isActive = false);
    };

    invitationCreate(channel, invitation) {
      return this.channelsApi.invitationCreate(channel.id, invitation)
        .then(newInvitation => channel.invitations.push(newInvitation));
    };

    invitationDelete(channel, invitationId) {
      return this.channelsApi.invitationDelete(channel.id, invitationId)
        .then(() => remove(channel.invitations, {id: invitationId}));
    }

    memberUpdate(channel, memberId, member) {
      return this.channelsApi.memberUpdate(channel.id, memberId, member)
        .then(newChannel => angular.copy(newChannel, channel));
    }

    memberDelete(channel, memberId) {
      return this.channelsApi.memberDelete(channel.id, memberId)
        .then(() => remove(channel.members, {person: {id: memberId}}));
    }
  });
}
