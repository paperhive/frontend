'use strict';

import template from './channel-bookmarks-list.html';

export default function(app) {
  app.component('channelBookmarksList', {
    bindings: {
      channel: '<',
    },
    controller: class ChannelBookmarksList {
      static $inject = ['config', '$http'];
      constructor(public config, public $http) {
        $http.get(`${this.config.apiUrl}/channels/${this.channel.id}/bookmarks`)
          .then(response => this.bookmarks = response.data.bookmarks);
      }

    },
    template,
  });
}
