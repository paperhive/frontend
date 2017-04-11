import { difference, keys, some, values } from 'lodash';

require('./margin-cluster-pane.less');

export default function(app) {
  app.component('marginClusterPane', {
    bindings: {
      cluster: '<',
      onClose: '&',
      onDiscussionSubmit: '&',
      onDiscussionUpdate: '&',
      onDiscussionDelete: '&',
      onReplySubmit: '&',
      onReplyUpdate: '&',
      onReplyDelete: '&',
      onDiscussionHover: '&',
    },
    controller: class MarginClusterPaneCtrl {
      cluster: any;
      onClose: () => void;

      // map discussion ids to booleans indicating if there is unsaved content
      unsavedContent: {[key: string]: boolean} = {};

      static $inject = ['$scope', '$uibModal'];
      constructor($scope, public $uibModal) {
        $scope.$watchCollection('$ctrl.cluster.discussions', this.cleanupUnsavedContent.bind(this));
      }

      cleanupUnsavedContent() {
        const removeIds = difference(
          keys(this.unsavedContent),
          this.cluster.discussions.map(discussion => discussion.id),
        );
        removeIds.forEach(id => delete this.unsavedContent[id]);
      }

      close() {
        const unsavedContent = some(values(this.unsavedContent));
        if (!unsavedContent) return this.onClose();

        const modal = this.$uibModal.open({
          template: `
            <div class="modal-header">
              <h3 class="modal-title">Discard draft?</h3>
            </div>
            <div class="modal-body">
              There is an unsent draft. Do you want to discard it?
            </div>
            <div class="modal-footer">
              <button class="btn btn-danger" type="button" ng-click="$close()">Discard</button>
              <button class="btn btn-default" type="button" ng-click="$dismiss()">Cancel</button>
            </div>
          `,
        });

        modal.result.then(() => this.onClose());
      }
    },
    template: require('./margin-cluster-pane.html'),
  });
}
