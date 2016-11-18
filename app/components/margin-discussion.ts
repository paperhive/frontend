'use strict';
import * as angular from 'angular';
import { merge } from 'lodash';

import template from './margin-discussion.html';

export default function(app) {
  app.component('marginDiscussion', {
    bindings: {
      discussion: '<',
      showShareMessage: '<',
      onDiscussionUpdate: '&',
      onDiscussionDelete: '&',
      onReplySubmit: '&',
      onReplyUpdate: '&',
      onReplyDelete: '&'
    },
    template,
    controller: [
      '$scope', '$q', '$location', 'authService', 'channelService',
      function($scope, $q, $location, authService, channelService) {
        const ctrl = this;

        this.channelService = channelService;

        // expose discussion in template
        $scope.discussion = this.discussion;
        if (this.discussion && this.discussion.channel) {
          this.channel = channelService.get(this.discussion.channel);
        }

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
            {discussion: $scope.discussion.id}
          );
          $q.when(ctrl.onReplySubmit({reply: reply}))
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
        $scope.replyCtrl = ['$scope', $scope => {
          $scope.replyState = {};
          $scope.replyDelete = reply => {
            $scope.replyState.submitting = true;
            $q.when(ctrl.onReplyDelete({reply: reply}))
              .finally(() => $scope.replyState.submitting = false);
          };
        }];

        // reply controller (for editing)
        // TODO: remove controller (move into new component)
        $scope.replyEditCtrl = ['$scope', $scope => {
          $scope.copy = angular.copy($scope.reply);
          $scope.replyUpdate = () => {
            $scope.replyState.submitting = true;
            $q.when(ctrl.onReplyUpdate(
              {$replyOld: $scope.reply, $replyNew: $scope.copy}
            ))
              .then(function() {
                $scope.replyState.editing = false;
              })
              .finally(function() {
                $scope.replyState.submitting = false;
              });
          };
        }];
      }]
    }
  );
};
