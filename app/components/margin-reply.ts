export default function(app) {
  app.component('marginReply', {
    bindings: {
      reply: '<',
      onUpdate: '&',
      onDelete: '&',
      onUnsavedContentUpdate: '&',
    },
    controller: class MarginReplyCtrl {
      reply: any;
      onDelete: (o: {reply: any}) => Promise<any>;
      onUnsavedContentUpdate: (o: {unsavedContent: boolean}) => void;
      editing: boolean;
      submitting: boolean;

      static $inject = ['authService', '$q', '$scope'];
      constructor(public authService, public $q, public $scope) {
        $scope.$watch('$ctrl.editing', this.updateUnsavedContent.bind(this));
      }

      updateUnsavedContent() {
        this.onUnsavedContentUpdate({unsavedContent: this.editing});
      }

      delete() {
        this.submitting = true;
        this.$q.when(this.onDelete({reply: this.reply}))
          .finally(() => this.submitting = false);
      }
    },
    template: require('./margin-reply.html'),
  });
}
