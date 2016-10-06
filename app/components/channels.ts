'use strict';
import template from './channels.html';

export default function(app) {
  app.component('channels', {
    controller: class ChannelsCtrl {
      static $inject = ['$location', 'channelService'];
      constructor(public $location, public channelService) {}

      openChannel(id) {
        this.$location.path(`/channels/${id}`);
      }
    },
    template,
  });
};
