import { cloneDeep, find, merge } from 'lodash';

export default function(app) {
  app.component('discussionThreadView', {
    bindings: {
      discussions: '<',
      onDiscussionUpdate: '&',
      onReplyDelete: '&',
      onReplySubmit: '&',
      onReplyUpdate: '&',
    },
    controller: ['$routeSegment', '$scope', 'authService', 'channelService', 'metaService',
      function($routeSegment, $scope, authService, channelService, metaService) {
        const $ctrl = this;

        this.auth = authService;
        this.channelService = channelService;

        $scope.$watchCollection('$ctrl.discussions', discussions => {
          // discussion with ID $routeSegment.$routeParams.discussionId
          $ctrl.discussion =
            find(discussions, {id: $routeSegment.$routeParams.discussionId});

          if ($ctrl.discussion) {
            // set meta data
            metaService.set({
              title: $ctrl.discussion.title + ' · PaperHive',
              meta: [
                {
                  name: 'author',
                  content: $ctrl.discussion.author.displayName
                },
                // TODO rather use title here?
                {
                  name: 'description',
                  content: 'Annotation by ' +
                    $ctrl.discussion.author.displayName + ': ' +
                    ($ctrl.discussion.body ?
                    $ctrl.discussion.body.substring(0, 150) : '')
                },
                {
                  name: 'keywords',
                  content: $ctrl.discussion.tags ?
                    $ctrl.discussion.tags.join(', ') : undefined
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
        $ctrl.updateDiscussion = function(_discussion) {
          const discussion = merge(
            {},
            $ctrl.discussion,
            _discussion
          );
          return $ctrl.onDiscussionUpdate({discussion});
        };

        $ctrl.addReply = function(_reply) {
          const reply = cloneDeep(_reply);
          reply.discussion = $ctrl.discussion.id;
          return $ctrl.onReplySubmit({reply});
        };
      }
    ],
    template: require('./discussion-thread-view.html'),
  });
};
