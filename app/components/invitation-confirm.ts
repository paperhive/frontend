'use strict';
import template from './invitation-confirm.html';

export default function(app) {
  app.component('invitationConfirm', {
    controller: class InvitationConfirmCtrl {
      invitation: string;
      inProgress = false;
      succeeded = false;
      error = false;

      static $inject = ['$http', '$location', '$scope', 'authService', 'channelService', 'config', 'notificationService'];
      constructor(public $http, public $location, public $scope, public authService, public channelService, public config, public notificationService) {
        this.token = $location.search().token;
        $http
          .get(`${config.apiUrl}/channels/token/${this.token}`)
          .then(response => this.invitation = response.data);
      }

      hasError(field) {
        const form = this.$scope.$$childHead.confirmationForm;
        return (form.$submitted || form[field].$touched) &&
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
              .then(() => {
                this.$location.url(`/channels/${channelId}`);
                if (this.password) {
                  setTimeout(() => {
                    this.notificationService.notifications.push({
                      type: 'info',
                      message: `Welcome to PaperHive! You can set your username
                        <a href="./settings" class="alert-link">here</a>.`
                    });
                  }, 100);
                }
              });
          })
          .finally(() => {
            this.inProgress = false;
            this.error = true;
          });
      }

      invitationDelete(channelId, invitationId) {
        this.invitationDeleting = invitationId;
        this.channelService.invitationDelete(channelId, invitationId, this.token)
          .then(() => this.$location.url('/'))
          .finally(() => this.invitationDeleting = false);
      }

    },
    template,
  });
}
