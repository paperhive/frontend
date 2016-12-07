export default function(app) {
  app.component('newReply', {
    bindings: {
      onSubmit: '&',
    },
    controller: class NewReplyCtrl {
      onSubmit: any;

      body: string;
      submitting: boolean;

      static $inject = ['$q', 'authService'];
      constructor(public $q, public authService) {}

      submit() {
        const reply = {
          body: this.body,
        };
        this.submitting = true;
        this.$q.when(this.onSubmit({reply}))
          .then(() => this.body = '')
          .finally(() => this.submitting = false);
      }
    },
    template: require('./new-reply.html'),
  });
};
