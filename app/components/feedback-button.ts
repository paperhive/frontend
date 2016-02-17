'use strict';

export default function(app) {
    app.component('feedbackButton', {
      controller: function() {
      },
      template:
      `<a type="link"
         class="ph-feedback hidden-xs hidden-sm"
         target="_blank"
         ng-href="
mailto:info@paperhive.org
?subject=Feedback
&body=Hi PaperHive,%0D%0A%0D%0A%0D%0A
"
         >
         <i class="fa fa-envelope ph-icon-margin"></i> Feedback
      </a>`
    });
};
