export default function(app) {
  app.component('channelInvitationNew', {
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '<',
    },
    controller: class ChannelInvitationNewCtrl {
      close: any;
      dismiss: any;
      resolve: any;

      error: boolean;
      inProgress: boolean;
      succeeded: boolean;

      email: string;
      roles = ['member', 'owner'];
      role = 'member';

      static $inject = ['$location', '$scope', 'channelService'];
      constructor(public $location, public $scope, public channelService) {}

      hasError(field) {
        const form = this.$scope.invitationForm;
        return form && (form.$submitted || form[field].$touched) &&
          form[field].$invalid;
      }

      submit() {
        this.error = false;
        this.inProgress = true;
        this.succeeded = false;
        this.channelService.invitationCreate(this.resolve.channelId, {
          email: this.email,
          roles: [this.role],
        }).then(() => {
          this.succeeded = true;
          this.inProgress = false;
          this.close();
          this.$location.path(`/channels/${this.resolve.channelId}/members`);
        }, (error) => {
          this.succeeded = false;
          this.inProgress = false;
          this.error = error.data.message;
        });
      }
    },
    template: require('./channel-invitation-new.html'),
  });
};
