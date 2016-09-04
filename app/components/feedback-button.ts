'use strict';

export default function(app) {
  app.component('feedbackButton', {

    controller: class FeedbackButtonCtrl {
      static $inject = ['feedbackModal'];
      constructor(public feedbackModal) {}
    },

    template:
    `<a type="link"
       class="ph-badge-bottom btn btn-primary btn-sm hidden-xs hidden-sm"
       ng-click="$ctrl.feedbackModal.open()"
       >
       <i class="fa fa-fw fa-envelope"></i> Feedback
    </a>`
  });
};
