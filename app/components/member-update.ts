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

      roles = ['member', 'owner'];

      static $inject = ['$routeParams', '$scope', 'channelService'];
      constructor(public $routeParams, public $scope, public channelService) {
        this.role = this.resolve.member.roles[0];
      }

      submit(memberId) {
        this.inProgress = true;
        this.succeeded = false;
        this.channelService.memberUpdate(this.$routeParams.channelId, memberId, {
          roles: [this.role],
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
