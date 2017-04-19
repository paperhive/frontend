import angular from 'angular';
import { difference, keys, merge, some, values } from 'lodash';

const marginDiscussionUrlPopoverUrl =
  require('!ngtemplate-loader?relativeTo=/app!html-loader!./margin-discussion-url-popover.html');

export default function(app) {
  app.component('marginDiscussion', {
    bindings: {
      discussion: '<',
      showShareMessage: '<',
      isExpanded: '<',
      onDiscussionUpdate: '&',
      onDiscussionDelete: '&',
      onReplySubmit: '&',
      onReplyUpdate: '&',
      onReplyDelete: '&',
      onUnsavedContentUpdate: '&',
    },
    controller: [
      '$scope', '$q', '$location', 'authService', 'channelService',
      function($scope, $q, $location, authService, channelService) {
        const ctrl = this;

        this.marginDiscussionUrlPopoverUrl = marginDiscussionUrlPopoverUrl;
        this.channelService = channelService;

        // expose discussion in template
        $scope.discussion = this.discussion;
        $scope.$watch('$ctrl.discussion.channel', channel => {
          this.channel = channel && channelService.get(channel);
        });

        ctrl.unsavedContent = {};
        ctrl.cleanupUnsavedContent = function() {
          const removeIds = difference(
            keys(ctrl.unsavedContent),
            ctrl.discussion.replies.map(reply => reply.id),
          );
          removeIds.forEach(id => delete ctrl.unsavedContent[id]);
        };
        $scope.$watchCollection('$ctrl.discussion.replies', ctrl.cleanupUnsavedContent.bind(ctrl));

        ctrl.updateUnsavedContent = function () {
          const unsavedContent = ctrl.editing || ctrl.replyBody || some(values(ctrl.unsavedContent));
          ctrl.onUnsavedContentUpdate({unsavedContent});
        };
        $scope.$watch('$ctrl.editing', ctrl.updateUnsavedContent.bind(ctrl));
        $scope.$watch('$ctrl.replyBody', ctrl.updateUnsavedContent.bind(ctrl));
        $scope.$watchCollection('$ctrl.unsavedContent', ctrl.updateUnsavedContent.bind(ctrl));

        $scope.auth = authService;

        // required to work around event.stopPropagation() issue with
        // html5mode, see http://stackoverflow.com/q/28945975/1219479
        $scope.changePath = function(path) {
          $location.path(path);
        };

        // delete original comment (with discussion!)
        ctrl.discussionDelete = () => {
          ctrl.deleting = true;
          $q.when(ctrl.onDiscussionDelete({discussion: ctrl.discussion}))
            .finally(() => ctrl.deleting = false);
        };

        // add reply
        ctrl.replySubmit = () => {
          ctrl.submitting = true;
          const reply = {
            body: ctrl.replyBody,
            discussion: $scope.discussion.id,
          };
          $q.when(ctrl.onReplySubmit({reply}))
            .then(() => ctrl.replyBody = undefined)
            .finally(() => ctrl.submitting = false);
        };
      },
    ],
    template: require('./margin-discussion.html'),
  });
};
