'use strict';
import * as angular from 'angular';

import template from './template.html!text';

export default function(app) {
  app.component('marginDiscussion', {
    bindings: {
      discussion: '<',
      onOriginalUpdate: '&',
      onDiscussionDelete: '&',
      onReplySubmit: '&',
      onReplyUpdate: '&',
      onReplyDelete: '&'
    },
    template,
    controller: [
      '$scope', '$q', '$location', '$filter', 'authService', 'tourService',
      function($scope, $q, $location, $filter, authService, tourService) {
        const ctrl = this;

        $scope.tour = tourService;

        // expose discussion in template
        $scope.discussion = this.discussion;

        $scope.state = {};
        $scope.replyDraft = {};
        $scope.auth = authService;

        // required to work around event.stopPropagation() issue with
        // html5mode, see http://stackoverflow.com/q/28945975/1219479
        $scope.changePath = function(path) {
          $location.path(path);
        };

        $scope.filterRouteSegmentUrl = function(segment, args) {
          return $filter('routeSegmentUrl')(segment, args);
        };

        // original comment
        $scope.originalState = {};
        // update original comment
        $scope.originalEditCtrl = ['$scope', function($scope) {
          $scope.copy = angular.copy($scope.discussion);
          $scope.originalUpdate = function() {
            $scope.originalState.submitting = true;
            $q.when($scope.onOriginalUpdate(
              {$comment: $scope.copy}
            ))
              .then(function() {
                $scope.originalState.editing = false;
              })
              .finally(function() {
                $scope.originalState.submitting = false;
              });
          };
        }];

        // delete original comment (with discussion!)
        $scope.discussionDelete = function() {
          $scope.originalState.submitting = true;

          $q.when($scope.onDiscussionDelete({$discussion: $scope.discussion}))
            .finally(function() {
              $scope.originalState.submitting = false;
            });
        };

        // add reply
        $scope.replySubmit = function() {
          $scope.state.submitting = true;

          $q.when(ctrl.onReplySubmit({$reply: $scope.replyDraft}))
            .then(function() {
              $scope.replyDraft = {};
            })
            .finally(function() {
              $scope.state.submitting = false;
            });
        };

        // reply controller (for deletion)
        $scope.replyCtrl = ['$scope', function($scope) {
          $scope.replyState = {};

          $scope.replyDelete = function(reply) {
            $scope.replyState.submitting = true;

            $q.when(ctrl.onReplyDelete({$reply: reply}))
              .finally(function() {
                $scope.replyState.submitting = false;
              });
          };
        }];

        // reply controller (for editing)
        $scope.replyEditCtrl = ['$scope', function($scope) {
          $scope.copy = angular.copy($scope.reply);
          $scope.replyUpdate = function() {
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
