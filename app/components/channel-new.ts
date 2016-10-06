'use strict';
import template from './channel-new.html';

export default function(app) {
  app.component('channelNew', {
    controller: class ChannelNewCtrl {
      submitting: boolean;
      name: string;
      description: string;

      static $inject = ['$location', 'channelService'];
      constructor(public $location, public channelService) {}

      submit() {
        this.submitting = true;
        this.channelService.create({
          name: this.name,
          description: this.description,
        }).then(channel => {
          this.submitting = false;
          this.$location.path(`/channels/${channel.id}`);
        });
      }
    },

    template,
  });
};
