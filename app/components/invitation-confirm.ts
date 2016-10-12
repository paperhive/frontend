'use strict';
import template from './invitation-confirm.html';

export default function(app) {
  app.component('invitationConfirm', {
    controller: class InvitationConfirmCtrl {
      invitation: string;
      inProgress = false;
      succeeded = false;
      error = false;

      static $inject = ['$http', '$location', '$scope', 'authService', 'channelService', 'config'];
      constructor(public $http, public $location, public $scope, public authService, public channelService, public config) {
        this.token = $location.search().token;
        $http
          .get(`${config.apiUrl}/channels/token/${this.token}`)
          .then(response => this.invitation = response.data);
      }

      hasError(field) {
        const form = this.$scope.confirmationForm;
        return form && (form.$submitted || form[field].$touched) &&
          form[field].$invalid;
      }

      invitationConfirm(channelId, invitationId) {
        this.inProgress = true;
        this.error = undefined;
        this.channelService.invitationConfirm(channelId, invitationId, this.token, {password: this.password})
          .then((data) => {
            this.inProgress = false;
            this.succeeded = true;
            this.authService.loginToken(data.authToken)
              .then(() => this.$location.url(`/channels/${channelId}`));
          })
          .finally(() => {
            this.inProgress = false;
            this.error = true;
          });
      }

      invitationDelete(channelId, invitationId) {
        this.invitationDeleting = invitationId;
        this.channelService.invitationDelete(channelId, invitationId)
          .finally(() => this.invitationDeleting = false);
      }

    },
    template,
  });
}
