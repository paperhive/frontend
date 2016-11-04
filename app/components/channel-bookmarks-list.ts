'use strict';

import template from './channel-bookmarks-list.html';

export default function(app) {
  app.component('channelBookmarksList', {
    bindings: {
      bookmarks: '<',
      channel: '<',
    },
    template,
  });
}
