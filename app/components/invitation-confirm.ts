'use strict';
import template from './invitation-confirm.html';

export default function(app) {
  app.component('invitationConfirm', {
    controller: class InvitationConfirmCtrl {
      invitation: string;

      static $inject = ['$http', '$location', 'config'];
      constructor(public $http, public $location, public config) {
        const token = $location.search().token;
        $http
          .get(`${config.apiUrl}/channels/token/${token}`)
          .then(response => this.invitation = response.data);
      }
    },
    template,
  });
}
