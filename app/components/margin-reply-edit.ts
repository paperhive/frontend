import angular from 'angular';

export default function(app) {
  app.component('marginReplyEdit', {
    bindings: {
      reply: '<',
      onSubmit: '&',
      onDiscard: '&',
    },
    controller: [
      '$scope', '$q',
      function($scope, $q) {
        const ctrl = this;

        ctrl.replyCopy = angular.copy(ctrl.reply);

        ctrl.submit = () => {
          $q.when(ctrl.onSubmit({reply: ctrl.replyCopy}))
            .then(() => ctrl.onDiscard())
            .finally(() => ctrl.submitting = false);
        };
      },
    ],
    template: require('./margin-reply-edit.html'),
  });
}
