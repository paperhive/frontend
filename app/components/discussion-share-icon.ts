require('./discussion-share-icon.less');

const popoverUrl = require('!ngtemplate-loader?relativeTo=/app!html-loader!./discussion-share-icon-popover.html');

export default function(app) {
  app.component('discussionShareIcon', {
    bindings: {
      discussion: '<',
    },
    controller: class DiscussionShareIconCtrl {
      popoverUrl = popoverUrl;
    },
    template: `
      <a class="btn btn-link btn-xs"
        uib-tooltip="Share URL"
        tooltip-class="tooltip-nowrap"
        uib-popover-template="$ctrl.popoverUrl"
        popover-placement="bottom-right"
        popover-trigger="'outsideClick'"
        role="button"
        ng-href="{{'documents' | routeSegmentUrl}}?a=d:{{$ctrl.discussion.id}}"
        ng-click="$event.preventDefault()"
      >
        <i class="fa fa-fw fa-lg fa-share-alt"></i>
      </a>
    `,
  });
}
