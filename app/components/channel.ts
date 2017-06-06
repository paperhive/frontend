import { find, includes } from 'lodash';

export default function(app) {
  app.component('channel', {
    controller: class ChannelCtrl {
      isOwner: boolean;
      channel: any;
      bookmarks: any[];

      static $inject = ['$http', '$routeParams', '$scope', '$uibModal',
        'authService', 'channelService', 'config'];
      constructor(public $http, public $routeParams, public $scope,
                  public $uibModal, public authService, public channelService,
                  public config) {
        $scope.$watchCollection('$ctrl.channel.members', members => {
          if (!members) this.isOwner = false;
          const self: any = authService.user && find(members, {person: {id: authService.user.id}});
          this.isOwner = self && includes(self.roles, 'owner');
        });

        $scope.$watch(
          () => channelService.get($routeParams.channelId),
          channel => {
            this.channel = channel;
            channelService.selectChannel(channel);
          },
        );

        $scope.$watch('$ctrl.authService.user', user => {
          if (!user) return;
          $http.get(`${this.config.apiUrl}/channels/${this.$routeParams.channelId}/bookmarks`)
            .then(response => this.bookmarks = response.data.bookmarks);
        });
      }

      invitationLinkModalOpen() {
        this.$uibModal.open({
          component: 'channelInvitationLink',
          resolve: {
            channel: () => this.channel,
          },
        });
      };

      invitationModalOpen() {
        this.$uibModal.open({
          component: 'channelInvitationNew',
          resolve: {
            channelId: () => this.$routeParams.channelId,
          },
        });
      };

    },
    template: require('./channel.html'),
  });
};
