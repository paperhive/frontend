'use strict';
import template from './channels-invitations.html';

export default function(app) {
  app.component('channelsInvitations', {
    controller: class ChannelsInvitationsCtrl {
      static $inject = ['channelService'];
      constructor(public channelService) {}
    },
    template,
  });
};
