'use strict';

import template from './channels.html';

export default function(app) {
  app.component('channels', {
    controller: class ChannelsCtrl {
      static $inject = ['channelService'];
      constructor(public channelService) {}
    },
    template,
  });
};
