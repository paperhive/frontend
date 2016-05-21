'use strict';
import template from './template.html!text';

class NewReplyCtrl {
  body: string;
  submitting: boolean;

  static $inject = ['$q'];
  constructor(public $q) {}

  submit() {
    const reply = {
      body: this.body,
    };
    this.submitting = true;
    this.$q.when(this.onSubmit({reply}))
      .then(() => this.body = '')
      .finally(() => this.submitting = false);
  }
}

export default function(app) {
    app.component('newReply', {
      bindings: {
        onSubmit: '&',
      },
      controller: NewReplyCtrl,
      template,
    });
};
