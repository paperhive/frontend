import * as angular from 'angular';

export default function(app) {
  app.component('marginDiscussionEdit', {
    bindings: {
      discussion: '<',
      onSubmit: '&',
      onDiscard: '&',
    },
    controller: [
      '$scope', '$q',
      function($scope, $q) {
        const ctrl = this;

        ctrl.discussionCopy = angular.copy(ctrl.discussion);

        ctrl.submit = () => {
          $q.when(ctrl.onSubmit({discussion: ctrl.discussionCopy}))
            .then(() => ctrl.onDiscard())
            .finally(() => ctrl.submitting = false);
        };
      },
    ],
    template: require('./margin-discussion-edit.html'),
  });
}
