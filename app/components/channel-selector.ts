export default function(app) {
  app.component('channelSelector', {
    bindings: {
      documentItem: '<',
      discussions: '<',
    },
    controller: class ChannelSelectorCtrl {
      documentItem: any;
      discussions: any[];

      publicDiscussions: number;
      onlyMeDiscussions: number;
      channelDiscussions: any;

      channels: any[];

      static $inject = ['$scope', '$uibModal', 'authService', 'channelService'];
      constructor($scope, public $uibModal, public authService, public channelService) {
        $scope.$watch('$ctrl.documentItem', this.update.bind(this));
        $scope.$watchCollection('$ctrl.documentItem.channelShares', this.update.bind(this));
        $scope.$watchCollection('$ctrl.discussions', this.update.bind(this));
      }

      update() {
        this.updateChannelDiscussions();
        this.updateChannels();
        this.updateSelectedChannel();
      }

      updateChannels() {
        this.channels = [];
        if (!this.documentItem) return;
        if (this.documentItem.public) {
          this.channels = [...this.channelService.channels];
        } else {
          const {channelShares} = this.documentItem || [];
          this.channels = this.channelService.channels.filter(channel => {
            if (this.channelDiscussions[channel.id]) return true;
            if (channelShares.find(share => share.channel === channel.id)) return true;
            return false;
          });
        }
      }

      updateSelectedChannel() {
        if (!this.documentItem) return;

        // all channels valid on public document items
        if (this.documentItem.public) return;

        // only me valid on all document items
        if (this.channelService.onlyMe) return;

        // current channel in available channels
        const {selectedChannel} = this.channelService;
        if (selectedChannel && this.channels.find(channel => channel.id === selectedChannel.id)) return;

        this.channelService.selectOnlyMe();
      }

      updateChannelDiscussions() {
        this.publicDiscussions = 0;
        this.onlyMeDiscussions = 0;
        this.channelDiscussions = {};

        if (!this.discussions) return;

        this.discussions.forEach(discussion => {
          if (discussion.onlyMe) {
            this.onlyMeDiscussions++;
            return;
          }
          if (!discussion.channel) {
            this.publicDiscussions++;
            return;
          }
          if (!this.channelDiscussions[discussion.channel]) {
            this.channelDiscussions[discussion.channel] = 0;
          }
          this.channelDiscussions[discussion.channel]++;
        });
      }

      newChannelModalOpen() {
        this.$uibModal.open({component: 'channelNew'});
      }
    },
    template: require('./channel-selector.html'),
  });
}
