import { find, pick } from 'lodash';

import template from './template.html!text';

export default function(app) {
  app.component(
    'discussionThreadView', {
      template,
      bindings: {
        discussions: '<',
        onOriginalUpdate: '&',
        onReplySubmit: '&',
        onReplyUpdate: '&',
        onReplyDelete: '&'
      },
      controller: [
        '$scope', 'authService', '$routeSegment', '$http', 'config',
        'notificationService', 'metaService', '$q',
        function(
          $scope, authService, $routeSegment, $http, config,
          notificationService, metaService, $q
        ) {
          const ctrl = this;

          $scope.auth = authService;

          $scope.$watch('$ctrl.discussions.stored', function(discussions) {
            // discussion with ID $routeSegment.$routeParams.discussionId
            $scope.discussion = find(
              discussions,
              {id: $routeSegment.$routeParams.discussionId}
            );
            if ($scope.discussion) {
              // set meta data
              metaService.set({
                title: $scope.discussion.title + ' · PaperHive',
                meta: [
                  {
                    name: 'author',
                    content: $scope.discussion.author.displayName
                  },
                  // TODO rather use title here?
                  {
                    name: 'description',
                    content: 'Annotation by ' +
                      $scope.discussion.author.displayName + ': ' +
                      ($scope.discussion.body ?
                      $scope.discussion.body.substring(0, 150) : '')
                  },
                  {
                    name: 'keywords',
                    content: $scope.discussion.tags ?
                      $scope.discussion.tags.join(', ') : undefined
                  }
                ]
              });
            }
          });

          // Problem:
          //   When updateTitle() is run, the newTitle needs to be populated in
          //   the scope. This may not necessarily be the case.
          // Workaround:
          //   Explicitly set the newTitle in the $scope.
          // Disadvantage:
          //   The title is set twice, and this is kind of ugly.
          // TODO find a better solution
          $scope.updateTitle = function(newTitle) {
            $scope.discussion.title = newTitle;
            $scope.updateDiscussion($scope.discussion)
          };

          $scope.updateDiscussion = function(comment) {
            return ctrl.onOriginalUpdate({
              $discussion: $scope.discussion,
              $comment: comment,
            });
          };

          $scope.addReply = function(body) {
            return ctrl.onReplySubmit({
              $discussion: $scope.discussion,
              $reply: {body}
            });
          };

          $scope.updateReply = function(reply, index) {
            return ctrl.onReplyUpdate({
              $discussion: $scope.discussion,
              $replyOld: $scope.discussion.replies[index],
              $replyNew: reply,
            });
          };

          $scope.deleteReply = function(reply) {
            return ctrl.onReplyDelete({
              $discussion: $scope.discussion,
              $reply: reply,
            });
          };
        }
      ]}
  );
};
