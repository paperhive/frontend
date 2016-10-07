import { assign } from 'lodash';

export default function(app) {
  app.service('channelsApi', class ChannelApi {
    static $inject = ['$http', 'config', 'notificationService'];
    constructor(public $http, public config, public notificationService) {}

    create(channel) {
      return this.$http.post(`${this.config.apiUrl}/channels`, channel)
        .catch(this.notificationService.httpError('could not create channel'))
        .then(response => response.data);
    }

    getAll() {
      return this.$http.get(`${this.config.apiUrl}/channels`)
        .catch(this.notificationService.httpError('could not get channels'))
        .then(response => response.data);
    }

    get(channelId) {
      return this.$http.get(`${this.config.apiUrl}/channels/${channelId}`)
        .catch(this.notificationService.httpError('could not get channel'))
        .then(response => response.data);
    }

    update(channelId, channel) {
      return this.$http.put(`${this.config.apiUrl}/channels/${channelId}`, channel)
        .catch(this.notificationService.httpError('could not update channel'))
        .then(response => response.data);
    }

    activate(channelId) {
      return this.$http.post(`${this.config.apiUrl}/channels/${channelId}/active`)
        .catch(this.notificationService.httpError('could not activate channel'));
    }

    deactivate(channelId) {
      return this.$http.delete(`${this.config.apiUrl}/channels/${channelId}/active`)
        .catch(this.notificationService.httpError('could not deactivate channel'));
    }

    invitationCreate(channelId, invitation) {
      return this.$http.post(`${this.config.apiUrl}/channels/${channelId}/invitations`, invitation)
        .catch(this.notificationService.httpError('could not send invitation'))
        .then(response => response.data);
    }

    invitationDelete(channelId, invitationId) {
      return this.$http.delete(`${this.config.apiUrl}/channels/${channelId}/invitations/${invitationId}`)
        .catch(this.notificationService.httpError('could not delete invitation'));
    }

    invitationConfirm(channelId, invitationId) {
      return this.$http.post(`${this.config.apiUrl}/channels/${channelId}/invitations/${invitationId}/confirm`)
        .catch(this.notificationService.httpError('could not confirm invitation'))
        .then(response => response.data);
    }

    memberUpdate(channelId, memberId, member) {
      return this.$http.put(`${this.config.apiUrl}/channels/${channelId}/members/${memberId}`, member)
        .catch(this.notificationService.httpError('could not update member'))
        .then(response => response.data); // returns channel
    }

    memberDelete(channelId, memberId) {
      return this.$http.delete(`${this.config.apiUrl}/channels/${channelId}/members/${memberId}`)
        .catch(this.notificationService.httpError('could not delete member'));
      }
  });
}
