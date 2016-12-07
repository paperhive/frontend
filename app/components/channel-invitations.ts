export default function(app) {
  app.component('channelInvitations', {
    bindings: {
      channel: '<',
      isOwner: '<',
    },
    controller: class ChannelInvitationsCtrl {
      invitationDeleting = false;

      static $inject = ['channelService'];
      constructor(public channelService) {}

      invitationDelete(channelId, invitationId) {
        this.invitationDeleting = invitationId;
        this.channelService.invitationDelete(channelId, invitationId)
          .finally(() => this.invitationDeleting = false);
      }
    },
    template: require('./channel-invitations.html'),
  });
}
