import angular from 'angular';
import * as _ from 'lodash';
import { Mutex } from 'mutx';
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
  // Render an entire pdf;
  // Currently (2016-03-14), this directive cannot be implemented as a
  // component because it requires direct access to the DOM. However, this
  // directive follows a few basic rules that make it easier to switch to
  // angular2, see
  // http://teropa.info/blog/2015/10/18/refactoring-angular-apps-to-components.html
  app.directive('pdfFull', ['$q', '$timeout', '$window', function($q, $timeout, $window) {

    // render a page in a canvas
    class CanvasRenderer {
      container: JQuery;
      page: PDFPageProxy;
      canvas: HTMLCanvasElement;
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
        // new size
        const size = roundSize(viewport);

        // create canvas
        if (!this.canvas) {
          this.canvas = document.createElement('canvas');
          this.container.prepend(this.canvas);
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

    // render a page's text
    class TextRenderer {
      element: JQuery;
      page: PDFPageProxy;
      textContent: TextContent;
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
        if (!this.textContent) {
          this.textContent = await this.page.getTextContent();
        }

        // wipe all children from the container
        // TODO: figure out how to update via pdfjs
        this.element.empty();

        // kick off text rendering
        this.renderTask = PDFJS.renderTextLayer({
          container: this.element[0],
          textContent: this.textContent,
          viewport,
        });

        // wait for renderTask
        await this.renderTask;
      }
    }

    // TODO: implement!
    class LinkService {
      getDestinationHash(dest) {
        console.log(dest);
        return dest;
      }
    }

    // render pdf annotations (e.g., links)
    class AnnotationsRenderer {
      element: JQuery;
      linkService: any;
      page: PDFPageProxy;
      annotations: PDFAnnotations;

      constructor(element, page, linkService) {
        this.page = page;
        this.linkService = linkService;

        this.element = element;
      }

      async render(_viewport) {
        // get a non-flipped version of the viewport
        // andré: this took me a few hours, uaaargh! :)
        const viewport = _viewport.clone({
          dontFlip: true
        });

        if (!this.annotations) {
          this.annotations = await this.page.getAnnotations();
        }

        // wipe all children from the container
        // TODO: use AnnotationLayer.update()
        this.element.empty();

        PDFJS.AnnotationLayer.render({
          annotations: this.annotations,
          div: this.element[0], // layer:
          linkService: this.linkService,
          page: this.page,
          viewport: viewport,
        });
      }
    }

    // render a pdf page
    class PdfPage {
      element: JQuery;
      page: PDFPageProxy;
      pageNumber: number; // zero-based page-number
      pdf: PDFDocumentProxy;

      // renderer state
      renderedSize: {height: number, width: number};
      renderMutex: Mutex;
      canvasRenderer: CanvasRenderer;
      textRenderer: TextRenderer;
      annotationsRenderer: AnnotationsRenderer;

      constructor(pdf, pageNumber, element) {
        this.element = element;
        this.pageNumber = pageNumber;
        this.pdf = pdf;

        // set default height to DIN A4
        // (overwritten with actual page size below)
        this.updateSize({
          height: element[0].offsetWidth * Math.sqrt(2),
          width: element[0].offsetWidth,
        });

        // render mutex
        this.renderMutex = new Mutex();
      }

      // get viewport for this page
      getViewport() {
        const width = this.element[0].offsetWidth;
        if (width === 0) {
          throw new Error('Element has width zero. This is not enough.');
        }

        // scale such that the width of the viewport fills the element
        const originalViewport = this.page.getViewport(1.0);
        const scale = width / originalViewport.width;
        return this.page.getViewport(scale);
      }

      // initialize page (needs to be finished before any other method can
      // be called)
      async init() {
        if (!this.page) {
          // get page from pdf (pdfjs uses 1-based page numbers)
          this.page = await this.pdf.getPage(this.pageNumber + 1);

          // set element height
          this.updateSize();

          // add canvas renderer
          this.canvasRenderer = new CanvasRenderer(this.element, this.page);

          // add text renderer
          const textElement = angular.element('<div class="ph-pdf-text"></div>');
          this.element.append(textElement);
          this.textRenderer = new TextRenderer(textElement, this.page);

          // add annotations renderer
          const annotationsLayer = angular.element('<div class="ph-pdf-annotations"></div>');
          this.element.append(annotationsLayer);
          this.annotationsRenderer = new AnnotationsRenderer(annotationsLayer, this.page, new LinkService);
        }
      }

      // set page element height via css (faster than inserting a canvas)
      updateSize(_size = undefined) {
        const newSize = roundSize(_size || this.getViewport());

        // check against old size
        if (this.element.height() === newSize.height) return false;

        // set new height
        this.element.height(newSize.height);

        return true;
      }

      async render() {
        const viewport = this.getViewport();
        const size = roundSize(viewport);

        // stop if currently rendered size is up to date
        if (isSameSize(this.renderedSize, size)) {
          return;
        }

        // TODO: cancel renderers
        // this.canvasRenderer.cancel();
        // this.textRenderer.cancel();

        // wait for exclusive execution
        const unlock = await this.renderMutex.lock();

        // set rendered viewport (also indicates the viewport that is
        // currently rendered to other render calls)
        this.renderedSize = size;

        try {
          await this.canvasRenderer.render(viewport);
          await this.textRenderer.render(viewport);
          await this.annotationsRenderer.render(viewport);

          unlock();

          console.log(`page ${this.pageNumber} rendered`);
          // scope.onPageRendered({page: scope.page});

        } catch (error) {
          unlock();

          // return if cancelled
          if (error === 'cancelled') {
            console.log(`page ${this.pageNumber} cancelled`);
            return;
          }
          throw error;
        }
      }
    }

    // render a full pdf
    class PdfFull {
      element: JQuery;
      pdf: PDFDocumentProxy;
      pages: Array<PdfPage>;
      windowSize: {height: number, width: number};

      constructor(pdf, element) {
        this.element = element;
        this.pdf = pdf;
        this.pages = [];

        // wipe element children
        this.element.empty();
      }

      // initialize all pages
      async init() {
        const pageInits = [];

        // create pages
        for (let pageNumber = 0; pageNumber < this.pdf.numPages; pageNumber++) {
          // create page element
          const pageElement = angular.element('<div class="ph-pdf-page"></div>');
          this.element.append(pageElement);

          // init page
          const page = new PdfPage(this.pdf, pageNumber, pageElement);
          this.pages.push(page);
          pageInits.push(page.init());
        }

        // await all pageInits
        await Promise.all(pageInits);

        // re-render on resize and scroll events
        const _render = this.render.bind(this);
        angular.element($window).on('resize', _render);
        angular.element($window).on('scroll', _render);
        this.element.on('$destroy', () => {
          angular.element($window).off('resize', _render);
          angular.element($window).off('scroll', _render);
        });

        // render at least once
        await this.render();
      }

      // resize all and render relevant pages
      async render() {
        const newWindowSize = {
          height: angular.element($window).height(),
          width: angular.element($window).width(),
        };

        // resize pages only if the window size changed
        if (!this.windowSize || !isSameSize(this.windowSize, newWindowSize)) {
          // resize pages
          const pageResized = this.pages.map(page => page.updateSize());

          // store last processed window size
          this.windowSize = newWindowSize;

          // if at least one page has been resized: wait for DOM
          if (_.some(pageResized)) {
            await new Promise(resolve => $timeout(resolve));
          }
        }

        // detect relevant pages
        const renderPages = this.pages.filter(page => isVisible(page.element, $window));

        // render pages
        const renderPromises = renderPages.map(page => page.render());
      }
    }

    return {
      restrict: 'E',
      scope: {
        pdf: '<',
        onPageRendered: '&',
        onPageRemoved: '&',
      },
      link: async function(scope, element, attrs) {

        let pdfFull;
        scope.$watch('pdf', async function (pdf) {
          // destroy current pdf
          if (pdfFull) {
            pdfFull.destroy();
            pdfFull = undefined;
          }

          // do nothing if no pdf is given
          if (!pdf) return;

          // init new pdf
          pdfFull = new PdfFull(pdf, element);
          await pdfFull.init();
        });

        scope.$on('$destroy', () => {
          if (pdfFull) {
            pdfFull.destroy();
          }
        });
      },
    };
  }]);
}
