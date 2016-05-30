import { last } from 'lodash';

export default function(app) {
  app.component('pdfPopup', {
    bindings: {
      selectors: '<',
      pageNumber: '<',
    },
    controller: class PdfPopupCtrl {
      static $inject = ['$scope'];
      constructor(public $scope) {
        $scope.$watch('$ctrl.selectors', selectors => {
          // reset rect
          this.rect = undefined;

          if (!selectors) return;

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
    <button
      ng-if="$ctrl.rect"
      ng-click="$event.stopPropagation()"
      ng-style="{
        top: !$ctrl.selectors.isBackwards && (($ctrl.rect.top + $ctrl.rect.height) * 100 + '%'),
        left: !$ctrl.selectors.isBackwards && (($ctrl.rect.left + $ctrl.rect.width) * 100 + '%'),
        bottom: $ctrl.selectors.isBackwards && ((1 - $ctrl.rect.top) * 100 + '%'),
        right: $ctrl.selectors.isBackwards && ((1 - $ctrl.rect.left) * 100 + '%'),
      }"
      class="btn btn-default btn-xs ph-popup-button"
      uib-tooltip="Share text selection URL"
      tooltip-class="tooltip-nowrap"

    >
      <i class="fa fa-lg fa-share-alt"></i>
    </button>
    `
  });
}
