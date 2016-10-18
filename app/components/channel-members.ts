'use strict';

import { includes, remove } from 'lodash';

import template from './channel-members.html!text';

export default function(app) {
  app.component('channelMembers', {
    bindings: {
      channel: '<',
      isOwner: '<',
    },
    controller: class ChannelMembers {
      static $inject = ['channelService'];
      constructor(public channelService) {}

      memberDelete(channel, memberId) {
        this.memberDeleting = memberId;
        this.channelService.memberDelete(channel, memberId)
          .finally(() => this.memberDeleting = false);
      }

    },
    template,
  });
}
