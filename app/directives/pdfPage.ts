import * as _ from 'lodash';
import {PDFJS} from 'pdfjs-dist';

export default function(app) {
  // Render a pdf page; requires a <pdf> ancestor
  // Currently (2016-03-14), this directive cannot be implemented as a
  // component because it requires direct access to the DOM. However, this
  // directive follows a few basic rules that make it easier to switch to
  // angular2, see
  // http://teropa.info/blog/2015/10/18/refactoring-angular-apps-to-components.html
  app.directive('pdfPage', ['$parse', function($parse) {
    return {
      restrict: 'E',
      require: '^pdf',
      scope: {
        page: '<'
      },
      template: `
      <div class="ph-pdf-text"></div>
      <div class="ph-pdf-annotations"></div>
      `,
      link: function(scope, element, attrs, pdfCtrl) {
        // create canvas
        const canvas = document.createElement('canvas');
        element.prepend(canvas);

        // get elements from template
        const text = element.find('.ph-pdf-text');
        const annotations = element.find('.ph-pdf-annotations');


        function render(page) {
          const width = element[0].offsetWidth;
          if (width === 0) {
            throw new Error('Element has width zero. This is not enough.');
          }

          // scale such that the width of the viewport fills the element
          let scale = 1.0;
          let viewport = page.getViewport(scale);
          scale = width / viewport.width;
          viewport = page.getViewport(scale);

          // set canvas size
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // render page into canvas context
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          page.render(renderContext);
        }

        // get the page
        pdfCtrl.pdf.getPage(scope.page).then(
          page => {
            render(page);
          },
          error => {
            // error retrieving page
            notificationService.notifications.push({
              type: 'error',
              message: error.message || `Could not retrieve PDF page ${scope.page}.`,
            });
          }
        );
      },
    };
  }]);
}
