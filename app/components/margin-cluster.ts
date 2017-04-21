require('./margin-cluster.less');

export default function(app) {
  app.component('marginCluster', {
    bindings: {
      cluster: '<',
      onOpen: '&',
    },
    controller: class MarginClusterCtrl {
      channel: any;

      static $inject = ['$scope', 'channelService'];
      constructor($scope, public channelService) {
        $scope.$watch('$ctrl.cluster.discussions[0]', this.updateChannel.bind(this));
      }

      updateChannel(discussion) {
        this.channel = undefined;
        if (!discussion || !discussion.channel) return;
        this.channel = this.channelService.get(discussion.channel);
      }
    },
    template: require('./margin-cluster.html'),
  });
}
