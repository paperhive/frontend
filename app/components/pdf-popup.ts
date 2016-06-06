import { last } from 'lodash';

export default function(app) {
  app.component('pdfPopup', {
    bindings: {
      target: '<',
      pageNumber: '<',
    },
    controller: class PdfPopupCtrl {
      static $inject = ['$scope'];
      constructor(public $scope) {
        $scope.$watch('$ctrl.target', target => {
          // reset rect
          this.rect = undefined;

          if (!target || !target.selectors) return;

          const selectors = target.selectors;
          if (!selectors.pdfRectangles) {
            console.warn('selectors object does not have a pdfRectangles property');
            return;
          }

          // get rect where popup should be attached
          const rect = selectors.isBackwards ?
            // backwards: place popup at top left corner of first rect
            selectors.pdfRectangles[0] :
            // forward: place popup at bottom right corner of last rect
            last(selectors.pdfRectangles);

          // is this the right page?
          if (rect.pageNumber !== this.pageNumber) return;

          this.rect = rect;
        })
      }
    },
    template: `
    <div ng-if="$ctrl.rect" ng-mousedown="$event.stopPropagation()">
      <button
        ng-style="{
          top: !$ctrl.target.selectors.isBackwards && (($ctrl.rect.top + $ctrl.rect.height) * 100 + '%'),
          left: !$ctrl.target.selectors.isBackwards && (($ctrl.rect.left + $ctrl.rect.width) * 100 + '%'),
          bottom: $ctrl.target.selectors.isBackwards && ((1 - $ctrl.rect.top) * 100 + '%'),
          right: $ctrl.target.selectors.isBackwards && ((1 - $ctrl.rect.left) * 100 + '%'),
        }"
        class="btn btn-default btn-xs ph-popup-button"
        uib-tooltip="Share text selection URL"
        tooltip-class="tooltip-nowrap"
        uib-popover-template="'html/directives/textSelectionUrlPopover.html'"
        popover-placement="bottom-right"
        popover-trigger="outsideClick"
      >
        <i class="fa fa-lg fa-share-alt"></i>
      </button>
    </div>
    `
  });
}
