'use strict';
import { cloneDeep } from 'lodash';

import template from './channel-settings.html!text';

export default function(app) {
  app.component('channelSettings', {
    bindings: {
      channel: '<',
      onChannelUpdate: '&',
      onChannelActivate: '&',
      onChannelDeactivate: '&',
    },
    controller: class ChannelSettings {
      submitting = false;
      activating = false;
      deactivating = false;
      name: string;
      description: string;

      $onChanges() {
        if (!this.channel) return;
        this.name = this.channel.name;
        this.description = this.channel.description;
      }

      channelUpdate() {
        const channel = {name: this.name, description: this.description};
        this.submitting = true;
        this.onChannelUpdate({channelId: this.channel.id, channel})
          .then(() => this.submitting = false);
      }

      channelActivate() {
        this.activating = true;
        this.onChannelActivate({channelId: this.channel.id})
          .then(() => this.activating = false);
      }

      channelDeactivate() {
        this.deactivating = true;
        this.onChannelDeactivate({channelId: this.channel.id})
          .then(() => this.deactivating = false);
      }
    },
    template
  });
}
