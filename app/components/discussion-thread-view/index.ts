import { find, pick } from 'lodash';

import template from './template.html!text';

export default function(app) {

  app.component(
    'discussionThreadView', {
      template,
      bindings: {
        discussions: '<',
      },
      controller: [
        '$scope', '$rootScope', 'authService', '$routeSegment', '$http', 'config',
        'notificationService', 'metaService',
        function(
          $scope, $rootScope, authService, $routeSegment, $http, config,
          notificationService, metaService
        ) {
          $scope.auth = authService;

          const ctrl = this;

          $scope.$watch('$ctrl.discussions.stored', function(discussions) {
            // discussion with ID $routeSegment.$routeParams.discussionId
            console.log(discussions);
            $scope.discussion = find(
              discussions,
              {id:  $routeSegment.$routeParams.discussionId}
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
            $scope.updateDiscussion($scope.discussion);
          };

          $scope.updateDiscussion = function(comment) {
            $scope.submitting = true;
            const newDiscussion = pick(
              comment,
              ['title', 'body', 'target', 'tags']
            );

            return $http({
              url: config.apiUrl + '/discussions/' + $routeSegment.$routeParams.discussionId,
              method: 'PUT',
              headers: {'If-Match': '"' + $scope.discussion.revision + '"'},
              data: newDiscussion
            })
            .success(function(discussion) {
              $scope.submitting = false;
              $scope.discussion = discussion;
            })
            .error(function(data) {
              $scope.submitting = false;
            })
            .error(notificationService.httpError('could not update discussion'));
          };

          $scope.addReply = function(body) {
            $scope.submitting = true;
            $http.post(
              config.apiUrl +
                '/replies/',
              {
                body: body,
                discussion: $routeSegment.$routeParams.discussionId
              }
            )
            .success(function(reply) {
              $scope.submitting = false;
              $scope.discussion.replies.push(reply);
            })
            .error(function(data) {
              $scope.submitting = false;
            })
            .error(notificationService.httpError('could not update reply'));
          };

          $scope.updateReply = function(comment, index) {
            return $http({
              url: config.apiUrl + '/replies/' + comment.id,
              method: 'PUT',
              headers: {'If-Match': '"' + comment.revision + '"'},
              data: {body: comment.body}
            })
            .success(function(data) {
              $scope.discussion.replies[index] = data;
            })
            .error(notificationService.httpError('could not update reply'));
          };

          $scope.deleteReply = function(comment, index) {
            return $http({
              url: config.apiUrl + '/replies/' + comment.id,
              method: 'DELETE',
              headers: {'If-Match': '"' + comment.revision + '"'}
            })
            .success(function(data) {
              $scope.discussion.replies.splice(index, 1);
            })
            .error(notificationService.httpError('could not delete reply'));
          };
        }
      ]}
  );
};
