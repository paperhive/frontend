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

      static $inject = ['$scope', '$window', 'channelService', 'config'];
      constructor($scope, $window, public channelService, config) {
        // remove trailing slash
        this.baseUrl = `${$window.location.origin}${config.baseHref}`.replace(/\/$/, '');

        $scope.$watch('$ctrl.resolve.channel.invitationLinkToken', this.updateLink.bind(this));
      }

      updateLink() {
        if (!this.resolve.channel) return;
        this.invitationLink = `${this.baseUrl}/channels/invitationLink?token=${this.resolve.channel.invitationLinkToken}`
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
