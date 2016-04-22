export default function(app) {
  app.component('pdfHighlight', {
    bindings: {
      highlight: '<',
      emphasized: '<',
      pageNumber: '<',
      onMouseenter: '&',
      onMouseleave: '&',
    },
    template: `
      <div class="ph-pdf-highlight"
        ng-repeat="rectangle in $ctrl.highlight.selectors.pdfRectangles"
        ng-if="rectangle.pageNumber === $ctrl.pageNumber"
        ng-style="{
          position: 'absolute',
          top: rectangle.top * 100 + '%',
          left: rectangle.left * 100 + '%',
          height: rectangle.height * 100 + '%',
          width: rectangle.width * 100 + '%',
        }"
        ng-class="{'ph-pdf-highlight-emphasize': $ctrl.emphasized}"
        ng-mouseenter="$ctrl.onMouseenter({
          highlight: $ctrl.highlight,
          pageNumber: $ctrl.pageNumber,
        })"
        ng-mouseleave="$ctrl.onMouseleave({
          highlight: $ctrl.highlight,
          pageNumber: $ctrl.pageNumber,
        })"
      ></div>
    `
  });
}
