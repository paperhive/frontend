'use strict';

import { find, includes } from 'lodash';

import template from './channel.html';

export default function(app) {
  app.component('channel', {
    controller: class ChannelCtrl {
      isOwner: boolean;

      static $inject = ['$routeParams', '$scope', 'authService', 'channelsApi'];
      constructor(public $routeParams, $scope, public authService, public channelsApi) {
        $scope.$watchCollection('$ctrl.channel.members', members => {
          if (!members) this.isOwner = false;
          const self = authService.user && find(members, {person: {id: authService.user.id}});
          this.isOwner = self && includes(self.roles, 'owner');
        });
      }

      $onChanges() {
        this.authService.loginPromise.then(() => {
          this.channelsApi.get(this.$routeParams.channelId)
            .then(channel => this.channel = channel);
        });
      };

      channelUpdate(channelId, channel) {
        return this.channelsApi.update(channelId, channel)
          .then(channel => this.channel = channel);
      };

      channelActivate(channelId) {
        return this.channelsApi.activate(channelId)
          .then(() => this.channel.isActive = true);
      };

      channelDeactivate(channelId) {
        return this.channelsApi.deactivate(channelId)
          .then(() => this.channel.isActive = false);
      };
    },
    template,
  });
};
