export default function(app) {
  app.component('channelMembers', {
    bindings: {
      channel: '<',
      isOwner: '<',
    },
    controller: class ChannelMembers {
      channel: any;
      isOwner: any;

      memberDeleting = false;

      static $inject = ['$uibModal', 'authService', 'channelService'];
      constructor(public $uibModal, public authService, public channelService) {}

      memberDelete(channel, memberId) {
        this.memberDeleting = memberId;
        this.channelService.memberDelete(channel, memberId)
          .finally(() => this.memberDeleting = false);
      }

      updateModalOpen(member) {
        this.$uibModal.open({
          component: 'channelMemberUpdate',
          resolve: {
            member: () => member,
            channelId: () => this.channel.id,
          },
        });
      };

    },
    template: require('./channel-members.html'),
  });
}
