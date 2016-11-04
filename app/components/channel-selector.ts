import template from './channel-selector.html';

export default function(app) {
  app.component('channelSelector', {
    bindings: {
      discussions: '<',
    },
    controller: class ChannelSelectorCtrl {
      discussions: Array<any>;

      publicDiscussions: number;
      channelDiscussions: any;

      static $inject = ['$scope', 'authService', 'channelService'];
      constructor($scope, public authService, public channelService) {
        $scope.$watchCollection('$ctrl.discussions', this.updateChannelDiscussions.bind(this));
      }

      updateChannelDiscussions() {
        this.publicDiscussions = 0;
        this.channelDiscussions = {};

        if (!this.discussions) return;

        this.discussions.forEach(discussion => {
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
    },
    template,
  });
};
