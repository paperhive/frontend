export default function(app) {
  app.component('pdfHighlight', {
    bindings: {
      highlight: '<',
      pageNumber: '<',
      onMouseenter: '&',
      onMouseleave: '&',
    },
    template: `
      <div class="ph-pdf-highlight"
        ng-repeat="rectangle in $ctrl.highlight.selectors.pdfRectangles"
        ng-if="rectangle.page === $ctrl.pageNumber"
        ng-style="{
          position: 'absolute',
          top: rectangle.top * 100 + '%',
          left: rectangle.left * 100 + '%',
          bottom: rectangle.bottom * 100 + '%',
          right: rectangle.right * 100 + '%',
        }"
        ng-mouseenter="$ctrl.onMouseenter({
          highlight: $ctrl.highlight,
          pageNumber: $ctrl.pageNumber,
        })"
        ng-mouseleave="$ctrl.onMouseleave({
          highlight: $ctrl.highlight,
          pageNumber: $ctrl.pageNumber,
        })"
      >{{$ctrl.test}}</div>
    `
  });
}
