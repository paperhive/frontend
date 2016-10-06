'use strict';
import template from './channels-channels.html';

export default function(app) {
  app.component('channelsChannels', {
    controller: class ChannelsChannelsCtrl {
      static $inject = ['$location', 'channelService'];
      constructor(public $location, public channelService) {}

      openChannel(id) {
        this.$location.path(`/channels/${id}`);
      }
    },
    template,
  });
};
