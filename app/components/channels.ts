'use strict';

import template from './channels.html';

export default function(app) {
  app.component('channels', {
    controller: class ChannelsCtrl {
      static $inject = ['$uibModal', 'channelService'];
      constructor(public $uibModal, public channelService) {}

      newChannelModalOpen() {
        this.$uibModal.open({
          component: 'channelNew',
          resolve: {
            redirect: () => true,
          },
        });
      };

    },
    template,
  });
};
