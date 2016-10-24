import template from './channel-selector.html';

export default function(app) {
  app.component('channelSelector', {
    controller: class ChannelSelectorCtrl {
      static $inject = ['authService', 'channelService'];
      constructor(public authService, public channelService) {}
    },
    template,
  });
};
