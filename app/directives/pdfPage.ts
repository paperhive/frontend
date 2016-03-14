import angular from 'angular';
import * as _ from 'lodash';
import {PDFJS} from 'pdfjs-dist';

// test if height and width properties of 2 objects are equal
function isSameSize(obj1, obj2) {
  return obj1.height === obj2.height && obj1.width === obj2.width;
}

// round viewport size to integers
function roundViewport(viewport) {
  return {
    height: Math.round(viewport.height),
    width: Math.round(viewport.width),
  };
}

// update the canvas size if necessary
function updateSize(element, canvas, page) {
  const width = element[0].offsetWidth;
  if (width === 0) {
    throw new Error('Element has width zero. This is not enough.');
  }

  // scale such that the width of the viewport fills the element
  const originalViewport = page.getViewport(1.0);
  const scale = width / originalViewport.width;
  const viewport = page.getViewport(scale);
  const roundedViewport = roundViewport(viewport);

  // set canvas size if it doesn't match the requested size
  if (!isSameSize(canvas, roundedViewport)) {
    canvas.height = roundedViewport.height;
    canvas.width = roundedViewport.width;
  }

  return viewport;
}

// determine if element is visible in current viewport
function isVisible(element, $window) {
  const elementTop = element[0].offsetTop;
  const elementBottom = elementTop + element[0].offsetHeight;

  const viewportTop = angular.element($window).scrollTop();
  const viewportBottom = viewportTop + angular.element($window).height();

  return elementTop <= viewportBottom && elementBottom >= viewportTop;
}

export default function(app) {
  // Render a pdf page; requires a <pdf> ancestor
  // Currently (2016-03-14), this directive cannot be implemented as a
  // component because it requires direct access to the DOM. However, this
  // directive follows a few basic rules that make it easier to switch to
  // angular2, see
  // http://teropa.info/blog/2015/10/18/refactoring-angular-apps-to-components.html
  app.directive('pdfPage', ['$q', '$timeout', '$window', function($q, $timeout, $window) {
    return {
      restrict: 'E',
      require: '^pdf',
      scope: {
        page: '<',
        onPageRendered: '&',
      },
      template: `
      <div class="ph-pdf-text"></div>
      <div class="ph-pdf-annotations"></div>
      `,
      link: async function(scope, element, attrs, pdfCtrl) {
        // create a promise that is resolved once the page has been initialized,
        // i.e., the page is displayed with the correct size (but not yet rendered)
        const pageInit = $q.defer();
        pdfCtrl.pageInitPromises.push(pageInit.promise);

        // create canvas
        const canvas = document.createElement('canvas');
        element.prepend(canvas);

        // set default height to DIN A4
        // (overwritten with actual page size in updateCanvasSize)
        canvas.width = element[0].offsetWidth;
        canvas.height = canvas.width * Math.sqrt(2);

        // get elements from template
        const text = element.find('.ph-pdf-text');
        const annotations = element.find('.ph-pdf-annotations');

        // get the page
        const page = await pdfCtrl.pdf.getPage(scope.page);

        // set actual page size
        updateSize(element, canvas, page);

        // wait for DOM
        await new Promise(resolve => $timeout(resolve));

        // resolve pageInit promise
        pageInit.resolve();

        // wait until all pages have initialized their sizes
        // (otherwise the visibility test may yield wrong results)
        await $q.all(pdfCtrl.pageInitPromises);

        // resize the canvas (if necessary) and render page (if in viewport)
        let renderedSize;
        let renderTask;
        async function render() {
          const viewport = updateSize(element, canvas, page);

          // nothing to do if page is invisible or the canvas is up to date
          if (!isVisible(element, $window) || (renderedSize && isSameSize(canvas, renderedSize))) {
            return;
          }

          // cancel running renderTask
          if (renderTask) {
            renderTask.cancel();
          }

          // kick off rendering
          renderTask = page.render({
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
          });
          renderedSize = roundViewport(viewport);

          // wait for renderTask
          try {
            await renderTask;
            renderTask = undefined;
          } catch (error) {
            if (error !== 'cancelled') {
              notificationService.notifications.push({
                type: 'error',
                message: error || `Could not render PDF page ${scope.page}.`,
              });
            }
          }

          scope.onPageRendered({page: scope.page});
        }

        // re-render on resize and scroll events
        angular.element($window).on('resize', render);
        angular.element($window).on('scroll', render);
        element.on('$destroy', () => {
          angular.element($window).off('resize', render);
          angular.element($window).off('scroll', render);
        });

        // render page at least once
        await render();
      },
    };
  }]);
}
