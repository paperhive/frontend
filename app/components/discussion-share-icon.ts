require('./discussion-share-icon.less');

const popoverUrl = require('!ngtemplate-loader?relativeTo=/app!html-loader!./discussion-share-icon-popover.html');

export default function(app) {
  app.component('discussionShareIcon', {
    bindings: {
      discussion: '<',
    },
    controller: class DiscussionShareIconCtrl {
      discussion: any;
      popoverUrl = popoverUrl;
      url: string;

      constructor() {
        const target = this.discussion.target;
        this.url = `/documents/items/${target.documentItem}?a=d:${this.discussion.id}`;
      }
    },
    template: `
      <a class="btn btn-link btn-xs"
        uib-tooltip="Share URL"
        tooltip-class="tooltip-nowrap"
        uib-popover-template="$ctrl.popoverUrl"
        popover-placement="bottom-right"
        popover-trigger="'outsideClick'"
        role="button"
        ng-href="{{$ctrl.url}}"
        ng-click="$event.preventDefault()"
      >
        <i class="fa fa-fw fa-lg fa-share-alt"></i>
      </a>
    `,
  });
}
