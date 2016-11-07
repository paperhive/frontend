'use strict';

import template from './channel-bookmark.html';
import { find } from 'lodash';

export default function(app) {
  app.component('channelBookmark', {
    bindings: {
      documentCtrl: '<',
    },
    controller: class channelBookmarkCtrl {
      submitting = false;

      static $inject = ['authService', 'channelService'];
      constructor(public authService, public channelService) {}

      bookmark(channel) {
        this.submitting = true;
        this.documentCtrl.bookmark(channel).then(() => this.submitting = false);
      }

      removeBookmark(channel) {
        this.submitting = true;
        this.documentCtrl.removeBookmark(channel).then(() => this.submitting = false);
      }
    },
    template,
  });
};
