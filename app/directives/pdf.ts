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

    // TODO: implement!
    class LinkService {
      getDestinationHash(dest) {
        console.log(dest);
        return dest;
      }
    }

    class AnnotationsRenderer {
      linkService: any;
      page: PDFPageProxy;
      annotations: PDFAnnotations;
      annotationsContainer: JQuery;

      constructor(container, page, linkService) {
        this.page = page;
        this.linkService = linkService;

        this.annotationsContainer = angular.element(
          '<div class="ph-pdf-annotations"></div>'
        );
        container.append(this.annotationsContainer);
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
        this.annotationsContainer.empty();

        PDFJS.AnnotationLayer.render({
          annotations: this.annotations,
          div: this.annotationsContainer[0], // layer:
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

          // add renderers
          this.canvasRenderer = new CanvasRenderer(this.element, this.page);
          // let textRenderer = new TextRenderer(text[0], page);
          // let annotationsRenderer = new AnnotationsRenderer(annotations[0], page, new LinkService);
        }
      }

      // set page element height via css (faster than inserting a canvas)
      updateSize(_size = undefined) {
        const size = _size || this.getViewport();
        this.element.height(Math.round(size.height));
      }

      async render() {
        const viewport = this.getViewport();
        const size = roundSize(viewport);

        // stop if size didn't change
        if (isSameSize(this.renderedSize, size)) {
          return;
        }

        // cancel renderers
        this.canvasRenderer.cancel();
        // textRenderer.cancel();

        // wait for exclusive execution
        const unlock = await this.renderMutex.lock();

        // update size
        this.updateSize(size);

        // wait for DOM before running visibility check
        await new Promise(resolve => $timeout(resolve));

        // nothing to do if invisible
        if (!isVisible(element, $window) || isSameSize(renderedSize, size)) {
          unlock();
          return;
        }

        // set rendered viewport (also indicates the viewport that is
        // currently rendered to other render calls)
        this.renderedSize = size;

        try {
          await this.canvasRenderer.render(viewport);
          await textRenderer.render(viewport);
          await annotationsRenderer.render(viewport);

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
    }

    // render a full pdf
    class PdfFull {
      element: JQuery;
      pdf: PDFDocumentProxy;
      pages: Array<PdfPage>;

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
      }

      // render relevant pages
      async render() {
        // resize pages
        const pageResized = this.pages.map(page => page.updateSize());



        // TODO: detect relevant pages
        this.pages.forEach(page => page.render());
      }
    }

    return {
      restrict: 'E',
      scope: {
        pdf: '<',
        onPageRendered: '&',
        onPageRemoved: '&',
      },
      /*
      template: `
      <div class="ph-pdf-text"></div>
      <div class="ph-pdf-annotations"></div>
      `,
      */
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

        /*
        // get elements from template
        const text = element.find('.ph-pdf-text');
        const annotations = element.find('.ph-pdf-annotations');




        // resize and render
        async function render() {

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
        */
      },
    };
  }]);
}
