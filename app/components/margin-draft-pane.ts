import { cloneDeep } from 'lodash';

require('./margin-draft-pane.less');

export default function(app) {
  app.component('marginDraftPane', {
    bindings: {
      selectors: '<',
      onSubmit: '&',
      onClose: '&',
      onUnsavedContentUpdate: '&',
    },
    controller: [
      '$scope', '$q', 'authService', 'channelService',
      function($scope, $q, authService, channelService) {
        const ctrl = this;
        $scope.auth = authService;
        $scope.comment = {};
        this.channelService = channelService;

        ctrl.updateUnsavedContent = function () {
          const unsavedContent = $scope.comment.title || $scope.comment.body;
          ctrl.onUnsavedContentUpdate({unsavedContent});
        };
        $scope.$watchGroup(['comment.title', 'comment.body'], ctrl.updateUnsavedContent);

        ctrl.submit = function() {

          const onlyMe = channelService.onlyMe;
          const channel = channelService.selectedChannel &&
            channelService.selectedChannel.id;
          const discussion = {
            target: {selectors: cloneDeep(ctrl.selectors)},
            title: $scope.comment.title,
            body: $scope.comment.body,
            authorOnly: onlyMe,
            channel,
          };
          delete discussion.target.selectors.isBackwards;
          ctrl.submitting = true;

          $q.when(ctrl.onSubmit({discussion}))
            .then(data => ctrl.onClose())
            .finally(() => ctrl.submitting = false);
        };
      },
    ],
    template: require('./margin-draft-pane.html'),
  });
};
