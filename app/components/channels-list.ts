'use strict';

import { find } from 'lodash';

import template from './channels-list.html';

export default function(app) {
  app.component('channelsList', {
    controller: class ChannelsListCtrl {
      static $inject = ['$location', 'authService', 'channelService'];
      constructor(public $location, public authService, public channelService) {}

      openChannel(id) {
        this.$location.path(`/channels/${id}`);
      }

      getMyRoles(channel) {
        const self = find(channel.members, {person: {id: this.authService.user.id}});
        if (!self) throw new Error('user not found in members');
        return self.roles;
      }

    },
    template,
  });
};
