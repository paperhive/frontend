import { difference, keys, some, values } from 'lodash';

require('./margin-cluster-pane.less');

export default function(app) {
  app.component('marginClusterPane', {
    bindings: {
      cluster: '<',
      currentDiscussion: '<',
      onClose: '&',
      onDiscussionSubmit: '&',
      onDiscussionUpdate: '&',
      onDiscussionDelete: '&',
      onReplySubmit: '&',
      onReplyUpdate: '&',
      onReplyDelete: '&',
      onDiscussionHover: '&',
      onUnsavedContentUpdate: '&',
    },
    controller: class MarginClusterPaneCtrl {
      cluster: any;
      onClose: () => void;
      onUnsavedContentUpdate: (o: {unsavedContent: boolean}) => void;

      // map discussion ids to booleans indicating if there is unsaved content
      unsavedContent: {[key: string]: boolean} = {};

      static $inject = ['$scope'];
      constructor($scope) {
        $scope.$watchCollection('$ctrl.cluster.discussions', this.cleanupUnsavedContent.bind(this));
        $scope.$watchCollection('$ctrl.unsavedContent', this.updateUnsavedContent.bind(this));
      }

      cleanupUnsavedContent() {
        const removeIds = difference(
          keys(this.unsavedContent),
          this.cluster.discussions.map(discussion => discussion.id),
        );
        removeIds.forEach(id => delete this.unsavedContent[id]);
      }

      updateUnsavedContent() {
        const unsavedContent = some(values(this.unsavedContent));
        this.onUnsavedContentUpdate({unsavedContent});
      }
    },
    template: require('./margin-cluster-pane.html'),
  });
}
