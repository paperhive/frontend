import angular from 'angular';
import * as _ from 'lodash';
import {PDFJS} from 'pdfjs-dist';

// test if height and width properties of 2 objects are equal
function isSameSize(obj1, obj2) {
  return obj1 && obj2 && obj1.height === obj2.height && obj1.width === obj2.width;
}

// round size to integers
function roundSize(size) {
  return {
    height: Math.round(size.height),
    width: Math.round(size.width),
  };
}

function getViewport(element, page) {
  const width = element[0].offsetWidth;
  if (width === 0) {
    throw new Error('Element has width zero. This is not enough.');
  }

  // scale such that the width of the viewport fills the element
  const originalViewport = page.getViewport(1.0);
  const scale = width / originalViewport.width;
  return page.getViewport(scale);
}

// determine if element is visible in current viewport
function isVisible(element, $window) {
  // relative to viewport.top
  const elementRect = element[0].getBoundingClientRect();
  const elementTop = elementRect.top;
  const elementBottom = elementRect.bottom;

  const viewportHeight = angular.element($window).height();

  // relax viewport constraint
  // (tight: elementTop <=  viewportHeight && elementBottom >= 0)
  return elementTop <= 2 * viewportHeight && elementBottom >= - viewportHeight;
}

export default function(app) {
  // Render a pdf page; requires a <pdf> ancestor
  // Currently (2016-03-14), this directive cannot be implemented as a
  // component because it requires direct access to the DOM. However, this
  // directive follows a few basic rules that make it easier to switch to
  // angular2, see
  // http://teropa.info/blog/2015/10/18/refactoring-angular-apps-to-components.html
  app.directive('pdfPage', ['$q', '$timeout', '$window', function($q, $timeout, $window) {

    /*
     * const unlock = await mutex.lock();
     * ...
     * unlock();
     */
    class Mutex {
      locks: Array;
      constructor() {
        this.locks = [];
      }
      async lock() {
        const mutex = this;

        // copy current locks array
        const locks = mutex.locks.slice();

        // use deferred instead of es6 promise because we need access to resolve
        // outside the promise body
        const deferred = $q.defer();
        const promise = deferred.promise;

        // enqueue
        mutex.locks.push(promise);

        // wait for all locks (except this one)
        await $q.all(locks);

        // checks if this promise is the first in line
        function assertState() {
          if (mutex.locks[0] !== promise) {
            throw new Error('Inconsistent Mutex state. Is every lock() followed by exactly one unlock()?');
          }
        }
        assertState();

        // return unlock function
        return () => {
          assertState();

          // remove lock promise
          mutex.locks.shift();

          // resolve lock promise
          deferred.resolve();
        };
      }
    }

    // render a page in a canvas
    class CanvasRenderer {
      element: JQuery;
      page: PDFPageProxy;
      canvas: HTMLCanvasElement;
      renderTask: PDFRenderTask; // currently running task

      constructor(element, page) {
        this.element = element;
        this.page = page;
      }

      // cancel running render()
      cancel() {
        if (this.renderTask) {
          // cancel running tasks
          this.renderTask.cancel();

          // reset state
          this.renderTask = undefined;
        }
      }

      async render(viewport) {
        // new size
        const size = roundSize(viewport);

        // create canvas
        if (!this.canvas) {
          this.canvas = document.createElement('canvas');
          this.element.prepend(this.canvas);
        }

        // update canvas size
        this.canvas.height = size.height;
        this.canvas.width = size.width;

        // kick off canvas rendering
        this.renderTask = this.page.render({
          canvasContext: this.canvas.getContext('2d'),
          viewport,
        });

        // wait for renderTask
        await this.renderTask;
      }
    }

    // render a page's text in a canvas
    class TextRenderer {
      container: JQuery;
      page: PDFPageProxy;
      textContent: TextContent;
      renderTask: PDFRenderTask; // currently running task

      constructor(container, page) {
        this.container = container;
        this.page = page;
      }

      // cancel running render()
      cancel() {
        if (this.renderTask) {
          // cancel running tasks
          this.renderTask.cancel();

          // reset state
          this.renderTask = undefined;
        }
      }

      async render(viewport) {
        if (!this.textContent) {
          this.textContent = await this.page.getTextContent();
        }

        // wipe all children from the container
        // TODO: figure out how to update via pdfjs
        angular.element(this.container).empty();

        // kick off text rendering
        this.renderTask = PDFJS.renderTextLayer({
          container: this.container,
          textContent: this.textContent,
          viewport,
        });

        // wait for renderTask
        await this.renderTask;
      }
    }

    return {
      restrict: 'E',
      require: '^pdf',
      scope: {
        page: '<',
        text: '<',
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

        // get elements from template
        const text = element.find('.ph-pdf-text');
        const annotations = element.find('.ph-pdf-annotations');

        // set parent element height via css (faster than inserting a canvas)
        function setSize(size) {
          element.height(Math.round(size.height));
        }

        // set default height to DIN A4
        // (overwritten with actual page size below)
        setSize({
          height: element[0].offsetWidth * Math.sqrt(2),
          width: element[0].offsetWidth,
        });

        // get the page
        const page = await pdfCtrl.pdf.getPage(scope.page);

        // set element height
        setSize(getViewport(element, page));

        // wait for DOM to reflect size changes
        await new Promise(resolve => $timeout(resolve));

        // resolve pageInit promise
        pageInit.resolve();

        // wait until all pages have initialized their sizes
        // (otherwise the visibility test may yield wrong results)
        await $q.all(pdfCtrl.pageInitPromises);

        // add renderers
        let canvasRenderer = new CanvasRenderer(element, page);
        let textRenderer = new TextRenderer(text[0], page);

        // render state
        let renderedSize;
        const renderMutex = new Mutex();

        // resize and render
        async function render() {
          const viewport = getViewport(element, page);
          const size = roundSize(viewport);

          // stop if size didn't change
          if (isSameSize(renderedSize, size)) {
            return;
          }

          // cancel renderers
          canvasRenderer.cancel();
          textRenderer.cancel();

          // wait for exclusive execution
          const unlock = await renderMutex.lock();

          // update size
          setSize(size);

          // wait for DOM before running visibility check
          await new Promise(resolve => $timeout(resolve));

          // nothing to do if invisible
          if (!isVisible(element, $window) || isSameSize(renderedSize, size)) {
            unlock();
            return;
          }

          // set rendered viewport (also indicates the viewport that is
          // currently rendered to other render calls)
          renderedSize = size;

          try {
            await canvasRenderer.render(viewport);
            await textRenderer.render(viewport);

            unlock();

            console.log(`page ${scope.page} rendered`);
            scope.onPageRendered({page: scope.page});

          } catch (error) {
            unlock();

            // return if cancelled
            if (error === 'cancelled') return;
            throw error;
          }
        }

        // re-render on resize and scroll events
        angular.element($window).on('resize', render);
        angular.element($window).on('scroll', render);
        element.on('$destroy', () => {
          angular.element($window).off('resize', render);
          angular.element($window).off('scroll', render);
        });

        // try to render page at least once
        await render();
      },
    };
  }]);
}
