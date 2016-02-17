'use strict';

export default function(app) {
  app.component('feedbackButton', {
    template:
    `<a type="link"
       class="ph-badge-left btn btn-primary btn-sm hidden-xs hidden-sm"
       ng-href="mailto:info@paperhive.org?subject=Feedback&body=Hi%20PaperHive,%0D%0A%0D%0A%0D%0A"
       >
       <i class="fa fa-fw fa-envelope"></i> Feedback
    </a>`
  });
};
