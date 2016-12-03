import * as angular from 'angular';
import { merge } from 'lodash';

const marginDiscussionUrlPopoverUrl =
  require('!ngtemplate-loader?relativeTo=/app!html-loader!./margin-discussion-url-popover.html');

export default function(app) {
  app.component('marginDiscussion', {
    bindings: {
      discussion: '<',
      showShareMessage: '<',
      onDiscussionUpdate: '&',
      onDiscussionDelete: '&',
      onReplySubmit: '&',
      onReplyUpdate: '&',
      onReplyDelete: '&',
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

        $scope.state = {};
        $scope.replyDraft = {};
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
          $scope.state.submitting = true;
          const reply = merge(
            {},
            $scope.replyDraft,
            {discussion: $scope.discussion.id},
          );
          $q.when(ctrl.onReplySubmit({reply}))
            .then(() => $scope.replyDraft = {})
            .finally(() => $scope.state.submitting = false);
        };

        // delete reply
        ctrl.replyDelete = (reply) => {
          $scope.state.submitting = true;
          $q.when(ctrl.onReplyDelete({reply}))
            .finally(() => $scope.state.submitting = false);
        };

        // reply controller (for deletion)
        // TODO: remove controller!
        $scope.replyCtrl = ['$scope', _$scope => {
          _$scope.replyState = {};
          _$scope.replyDelete = reply => {
            _$scope.replyState.submitting = true;
            $q.when(ctrl.onReplyDelete({reply}))
              .finally(() => _$scope.replyState.submitting = false);
          };
        }];

        // reply controller (for editing)
        // TODO: remove controller (move into new component)
        $scope.replyEditCtrl = ['$scope', _$scope => {
          _$scope.copy = angular.copy($scope.reply);
          _$scope.replyUpdate = () => {
            _$scope.replyState.submitting = true;
            $q.when(ctrl.onReplyUpdate(
              {$replyOld: _$scope.reply, $replyNew: _$scope.copy},
            ))
              .then(function() {
                _$scope.replyState.editing = false;
              })
              .finally(function() {
                _$scope.replyState.submitting = false;
              });
          };
        }];
      },
    ],
    template: require('./margin-discussion.html'),
  });
};
