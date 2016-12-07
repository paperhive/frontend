import { find } from 'lodash';

export default function(app) {
  app.component('channelsList', {
    controller: class ChannelsListCtrl {
      static $inject = ['$location', 'authService', 'channelService'];
      constructor(public $location, public authService, public channelService) {}

      getMyRoles(channel) {
        const self: any = find(channel.members, {person: {id: this.authService.user.id}});
        if (!self) throw new Error('user not found in members');
        return self.roles;
      }

    },
    template: require('./channels-list.html'),
  });
};
