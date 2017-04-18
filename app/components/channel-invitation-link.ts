
export default function(app) {
  app.component('channelInvitationLink', {
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '<',
    },
    controller: class ChannelInvitationLinkCtrl {
      close: any;
      dismiss: any;
      resolve: any;

      baseUrl: string;
      invitationLink: string;

      resetting: boolean;
      resetted: boolean;

      static $inject = ['$element', '$scope', '$window', 'channelService', 'clipboard', 'config'];
      constructor(public $element, $scope, $window, public channelService, public clipboard, config) {
        // remove trailing slash
        this.baseUrl = `${$window.location.origin}${config.baseHref}`.replace(/\/$/, '');

        $scope.$watch('$ctrl.resolve.channel.invitationLinkToken', this.updateLink.bind(this));
      }

      copy() {
        const input = this.$element.find('input');
        this.clipboard.copy(this.invitationLink);
        input.select();
      }

      updateLink() {
        if (!this.resolve.channel) return;
        this.invitationLink =
          `${this.baseUrl}/channels/invitationLink?token=${this.resolve.channel.invitationLinkToken}`;
      }

      resetLink() {
        this.resetting = true;
        this.resetted = false;
        this.channelService.invitationLinkTokenReset(this.resolve.channel.id)
          .then(() => this.resetted = true)
          .finally(() => this.resetting = false);
      }
    },
    template: require('./channel-invitation-link.html'),
  });
};
