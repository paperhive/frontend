'use strict';
import template from './channel-invitation.html';

export default function(app) {
  app.component('channelInvitation', {
    bindings: {
      close: '&',
      dismiss: '&'
    },
    controller: class ChannelInvitationCtrl {
      inProgress: boolean;
      succeeded: boolean;

      roles = [
        {'id': 1, 'name': 'member'},
        {'id': 2, 'name': 'owner'},
      ];

      static $inject = ['$routeParams', '$scope', 'channelService', 'notificationService'];
      constructor(public $routeParams, public $scope, public channelService, notificationService) {}

      hasError(field) {
        const form = this.$scope.invitationForm;
        return form && (form.$submitted || form[field].$touched) &&
          form[field].$invalid;
      }

      submit() {
        this.inProgress = true;
        this.succeeded = false;
        // TODO: remove this ugly hack when uibModal supports custom bindings
        this.channelService.invitationCreate(this.$routeParams.channelId, {
          email: this.email,
          roles: [this.roles[this.role - 1].name],
        }).then(() => {
          this.succeeded = true;
          this.inProgress = false;
          this.close();
        });
      }
    },
    template,
  });
};
