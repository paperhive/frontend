export default function(app) {
  app.component('channelSelector', {
    bindings: {
      availableChannels: '<',
      discussions: '<',
    },
    controller: class ChannelSelectorCtrl {
      availableChannels: {
        public: boolean;
        channels: string[];
      };
      discussions: any[];

      publicDiscussions: number;
      onlyMeDiscussions: number;
      channelDiscussions: any;

      channels: any[];

      static $inject = ['$scope', '$uibModal', 'authService', 'channelService'];
      constructor($scope, public $uibModal, public authService, public channelService) {
        $scope.$watchCollection('$ctrl.discussions', this.updateChannelDiscussions.bind(this));
      }

      updateChannelDiscussions() {
        this.publicDiscussions = 0;
        this.onlyMeDiscussions = 0;
        this.channelDiscussions = {};

        if (!this.discussions) return;

        this.discussions.forEach(discussion => {
          if (discussion.authorOnly) {
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
