'use strict';
import template from './channel-member-update.html';

export default function(app) {
  app.component('channelMemberUpdate', {
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
    controller: class ChannelMemberUpdateCtrl {
      inProgress: boolean;
      succeeded: boolean;

      roles = ['member', 'owner'];

      static $inject = ['channelService'];
      constructor(public channelService) {
        this.role = this.resolve.member.roles[0];
      }

      submit(memberId) {
        this.inProgress = true;
        this.succeeded = false;
        this.channelService.memberUpdate(this.resolve.channelId, memberId, {
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
