'use strict';
import template from './member-update.html';

export default function(app) {
  app.component('memberUpdate', {
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
    controller: class MemberUpdateCtrl {
      inProgress: boolean;
      succeeded: boolean;

      roles = [
        {'id': 1, 'name': 'member'},
        {'id': 2, 'name': 'owner'},
      ];

      static $inject = ['$routeParams', '$scope', 'channelService'];
      constructor(public $routeParams, public $scope, public channelService) {}

      submit(memberId) {
        this.inProgress = true;
        this.succeeded = false;
        this.channelService.memberUpdate(this.$routeParams.channelId, memberId, {
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
