import { find } from 'lodash';

export default function(app) {
  app.component('channelInvitationLinkConfirm', {
    controller: class ChannelInvitationLinkConfirmCtrl {
      channel: any;
      channelUpdating: boolean;
      isMember: boolean;
      joining: boolean;
      token: string;

      static $inject = ['$location', '$scope', 'authService', 'channelService'];
      constructor(public $location, $scope, public authService, public channelService) {
        this.token = this.$location.search().token;
        if (!this.token) throw new Error('token missing');
        $scope.$watch('$ctrl.authService.user', this.updateChannelInfo.bind(this));
      }

      join() {
        this.joining = true;
        this.channelService.invitationLinkTokenConfirm(this.channel.id, this.token)
          .then(() => this.$location.url(`/channels/${this.channel.id}`))
          .finally(() => this.joining = false);
      }

      updateChannelInfo() {
        this.channelUpdating = true;
        this.channelService.getFromInvitationLinkToken(this.token)
          .then(channel => {
            this.channel = channel;
            const user = this.authService.user;
            const memberIds = this.channel.members.map(member => member.person.id);
            this.isMember = user && memberIds.indexOf(user.id) !== -1;
          })
          .finally(() => this.channelUpdating = false)
      }
    },
    template: require('./channel-invitation-link-confirm.html'),
  });
}
