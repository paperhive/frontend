'use strict';

import template from './channel-bookmark.html';

export default function(app) {
  app.component('channelBookmark', {
    controller: class channelBookmarkCtrl {
      static $inject = ['authService', 'channelService'];
      constructor(public authService, public channelService) {}
    },
    template,
  });
};
