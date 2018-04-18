import { find, includes } from 'lodash';

export default function(app) {
  app.component('channel', {
    controller: class ChannelCtrl {
      isOwner: boolean;
      channel: any;
      documentItems: any[];

      static $inject = ['$http', '$routeParams', '$scope', '$uibModal',
        'authService', 'channelService', 'config', 'documentItemsApi'];
      constructor(public $http, public $routeParams, public $scope,
                  public $uibModal, public authService, public channelService,
                  public config, public documentItemsApi) {
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

        $scope.$watch('$ctrl.channel', this.updateDocuments.bind(this));
      }

      invitationLinkModalOpen() {
        this.$uibModal.open({
          component: 'channelInvitationLink',
          resolve: {
            channel: () => this.channel,
          },
        });
      }

      invitationModalOpen() {
        this.$uibModal.open({
          component: 'channelInvitationNew',
          resolve: {
            channelId: () => this.$routeParams.channelId,
          },
        });
      }

      updateDocuments() {
        this.documentItems = undefined;
        if (!this.channel) return;
        this.documentItemsApi.getByChannel(this.channel.id)
          .then(({documentItems}) => this.documentItems = documentItems);
      }
    },
    template: require('./channel.html'),
  });
}
