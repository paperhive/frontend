'use strict';
var angular = require('angular');

module.exports = function(app) {

  app.directive('marginDiscussion', [
    '$q', 'authService',
    function($q, authService) {
      return {
        restrict: 'E',
        scope: {
          discussion: '=',
          onReplySubmit: '&',
          onReplyUpdate: '&',
          onReplyDelete: '&',
        },
        templateUrl: 'templates/directives/marginDiscussion.html',
        link: function(scope, element, attrs) {
          scope.state = {};
          scope.replyDraft = {};
          scope.auth = authService;

          scope.replySubmit = function() {
            scope.state.submitting = true;

            $q.when(scope.onReplySubmit({$reply: scope.replyDraft}))
              .then(function() {
                scope.replyDraft = {};
              })
              .finally(function() {
                scope.state.submitting = false;
              });
          };

          scope.replyCtrl = ['$scope', function($scope) {
            $scope.replyState = {};

            scope.replyDelete = function(reply) {
              $scope.replyState.submitting = true;

              $q.when($scope.onReplyDelete({$reply: reply}))
                .finally(function() {
                  $scope.replyState.submitting = false;
                });
            };
          }];

          scope.replyEditCtrl = ['$scope', function($scope) {
            $scope.copy = angular.copy($scope.reply);
            $scope.replyUpdate = function() {
              $scope.replyState.submitting = true;
              $q.when(scope.onReplyUpdate(
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
        }
      };
    }
  ]);
};
