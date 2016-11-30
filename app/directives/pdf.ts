import angular from 'angular';
import { queue } from 'async';
import jquery from 'jquery';
import { clone, difference, filter, flatten, get, isArray, isEqual, isNumber, map, pick, some, uniq } from 'lodash';
import { PDFJS } from 'pdfjs-dist';
import rangy from 'rangy';

// test if height and width properties of 2 objects are equal
function isSameSize(obj1, obj2) {
  return obj1 && obj2 && obj1.height === obj2.height && obj1.width === obj2.width;
}

// round size to integers
function roundSize(size) {
  return {
    height: Math.floor(size.height),
    width: Math.floor(size.width),
  };
}

// determine if element is visible in current viewport
function isVisible(element, $window) {
  // relative to viewport.top
  const elementRect = element[0].getBoundingClientRect();
  const elementTop = elementRect.top;
  const elementBottom = elementRect.bottom;

  const viewportHeight = angular.element($window).height();

  return elementTop <= viewportHeight && elementBottom >= 0;
}

function getTextPositionSelector(range, container) {
  return range.toCharacterRange(container);
}

// compute textQuote selector for a range (relies on rangy's textRange)
function getTextQuoteSelector(range, container) {
  // create prefix/suffix range
  const prefixRange = range.cloneRange();
  const suffixRange = range.cloneRange();

  // move ranges to the left/right
  prefixRange.moveStart('character', -10);
  suffixRange.moveEnd('character', 10);

  // restrict ranges to element
  if (!rangy.dom.isAncestorOf(container, prefixRange.startContainer)) {
    prefixRange.setStart(container, 0);
  }
  if (!rangy.dom.isAncestorOf(container, suffixRange.endContainer)) {
    suffixRange.setEndAfter(container);
  }

  // move end/start of ranges to start/end of original range
  prefixRange.setEnd(range.startContainer, range.startOffset);
  suffixRange.setStart(range.endContainer, range.endOffset);

  return {
    content: range.text(),
    prefix: prefixRange.text(),
    suffix: suffixRange.text(),
  };
}

// returns all leaf text nodes that are descendants of node or are node
const getTextNodes = function(node) {
  if (!node) { return []; }
  if (node.nodeType === Node.TEXT_NODE) { return [node]; }

  // process childs
  let nodes = [];
  jquery(node).contents().each(function(index, el) {
    nodes = nodes.concat(getTextNodes(el));
  });
  return nodes;
};

function getRectanglesSelector(range, container) {
  const containerRect = container.getBoundingClientRect();

  // preserve current selection to work around browser bugs that result
  // in a changed selection
  // see https://github.com/timdown/rangy/issues/93
  // and https://github.com/timdown/rangy/issues/282
  const currentSelection = rangy.serializeSelection(rangy.getSelection(), true);

  // split start container if necessary
  range.splitBoundaries();

  // get TextNodes inside the range
  const textNodes = filter(
    getTextNodes(container),
    range.containsNodeText.bind(range)
  );

  // wrap each TextNode in a span to measure it
  // See this discussion:
  // https://github.com/paperhive/paperhive-frontend/pull/68#discussion_r25970589
  const rects = textNodes.map(node => {
    const $node = jquery(node);
    const $span = $node.wrap('<span/>').parent();
    const rect = $span.get(0).getBoundingClientRect();
    $node.unwrap();

    return {
      top: (rect.top - containerRect.top) / containerRect.height,
      left: (rect.left - containerRect.left) / containerRect.width,
      height: rect.height / containerRect.height,
      width: rect.width / containerRect.width,
    };
  });

  // re-normalize to undo splitBoundaries
  range.normalizeBoundaries();

  // restore selection (see above)
  if (currentSelection) {
    rangy.deserializeSelection(currentSelection);
  }

  return rects;
}

export default function(app) {
  // Render an entire pdf;
  // Currently (2016-03-14), this directive cannot be implemented as a
  // component because it requires direct access to the DOM. However, this
  // directive follows a few basic rules that make it easier to switch to
  // angular2, see
  // http://teropa.info/blog/2015/10/18/refactoring-angular-apps-to-components.html
  app.directive('pdfFull', ['$compile', '$document', '$http', '$q', 'scroll', '$timeout', '$window', 'config', function($compile, $document, $http, $q, scroll, $timeout, $window, config) {

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
        this.canvas.height = Math.round(size.height);
        this.canvas.width = Math.round(size.width);

        // compensate for zoom and device pixel ratio
        // important: do not round here!
        const pixelRatio = $window.devicePixelRatio || 1;
        this.canvas.style.width = (size.width / pixelRatio) + 'px';
        this.canvas.style.height = (size.height / pixelRatio) + 'px';

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
          enhanceTextSelection: true,
        });

        // wait for renderTask
        await this.renderTask;

        this.renderTask.expandTextDivs(true);

        // normalize the DOM subtree of the rendered page
        // (otherwise serialized ranges may be based on different DOM states)
        this.element[0].normalize();
      }
    }

    // a pdfjs-compliant linkService
    class LinkService {
      constructor(public onLinkCreate, public scrollToAnchor) {}

      getDestinationHash(dest) {
        return this.onLinkCreate({dest});
      }

      navigateTo(dest) {
        this.scrollToAnchor(`pdfd:${dest}`);
      }
    }

    // render pdf annotations (e.g., links)
    class AnnotationsRenderer {
      element: JQuery;
      linkService: any;
      page: PDFPageProxy;
      annotations: PDFAnnotations;
      tooltip: JQuery;

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

        // create tooltip
        // TODO: use angular here?
        this.element.find('section').on('dragstart', event => {
          if (this.tooltip) this.tooltip.remove();
          const isMac = /Mac/.test($window.navigator.platform);
          this.tooltip = jquery(
            `<div class="tooltip top fade" role="tooltip">
              <div class="tooltip-arrow"></div>
              <div class="tooltip-inner">
                Press and hold ${isMac ? 'cmd (⌘)' : 'Ctrl+Alt'} to select text
                inside a link.
              </div>
            </div>`
          );
          this.tooltip.appendTo(this.element);
          const target = jquery(event.currentTarget);
          const position = target.position();
          this.tooltip.css({
            top: position.top - this.tooltip.height() - 8,
            left: position.left + target.width() / 2 - this.tooltip.width() / 2,
          });
          setTimeout(() => this.tooltip.addClass('in'), 0);
        });
        this.element.find('a').on('dragend', event => {
          if (this.tooltip) {
            const tooltip = this.tooltip;
            this.tooltip = undefined;
            tooltip.removeClass('in');
            setTimeout(() => tooltip.remove(), 500);
          }
        });
      }
    }

    // render a pdf page
    class PdfPage {
      // page not set: call init() before!
      page: PDFPageProxy;
      initializedPageSize: boolean;
      initializedRenderers: boolean;
      pageSize: any; // TODO: remove?
      textFocused: boolean = false;
      textContent: any;

      // renderer state
      renderedSize: {height: number, width: number};
      canvasRenderer: CanvasRenderer;
      textRenderer: TextRenderer;
      annotationsRenderer: AnnotationsRenderer;

      constructor(public pdf: PDFDocumentProxy, public pageNumber: number,
          public element: JQuery, public scope: any,
          public linkService, public defaultPageSize, initialWidth: number) {
        // update size to default size
        this.updateSize(initialWidth);
      }

      // get viewport for this page
      getViewport() {
        const width = this.element[0].offsetWidth;
        if (width === 0) {
          throw new Error('Element has width zero. This is not enough.');
        }

        // scale such that the width of the viewport fills the element
        const scale = width / this.pageSize.width;

        // respect zoom / native device resolution
        const pixelRatio = $window.devicePixelRatio || 1;

        // viewport:
        return {
          viewport: this.page.getViewport(scale),
          deviceViewport: this.page.getViewport(scale * pixelRatio),
        };
      }

      async getPageText() {
        this.textContent = await this.page.getTextContent();
        return this.textContent.items.map(text => text.str).join(' ');
      }

      getBoxPositions(curPagePositions) {
        // check if there is a located position on current page
        if (curPagePositions.length > 0) {
          let strSum = 0;
          let index = 0;
          let boxPositions = [];
          curPagePositions.forEach(pos => {
            // sum up all string fragments of every page as long as position is not located
            while (pos.positionOnPage > strSum && index < this.textContent.items.length) {
              // take account of added space while joining strings
              strSum += this.textContent.items[index].str.length + 1;
              index++;
            }
            // if position is located: store textObject containing transformation matrix
            boxPositions.push({
              pageNumber: pos.pageNumber,
              positionOnPage: pos.positionOnPage,
              textObject: this.textContent.items[index - 1],
            });
          });
          console.log(boxPositions);
        }
      }

      async initPageSize(_width = undefined) {
        if (this.initializedPageSize) return false;

        // get page from pdf (pdfjs uses 1-based page numbers)
        this.page = await this.pdf.getPage(this.pageNumber);

        // get page size
        this.pageSize = this.page.getViewport(1.0);

        // update element size
        this.updateSize(_width);

        this.initializedPageSize = true;
        return true;
      }

      // initialize page (needs to be finished before any other method can
      // be called)
      async initRenderers() {
        if (this.initializedRenderers) return false;

        // add canvas renderer
        const canvasContainer = angular.element('<div class="ph-pdf-canvas"></div>');
        this.element.append(canvasContainer);
        this.canvasRenderer = new CanvasRenderer(canvasContainer, this.page);

        // add highlights layer
        // TODO: sort more efficiently (e.g., in pdfFull directive)!
        const highlightsLayer = $compile(`
          <div class="ph-pdf-highlights">
            <pdf-highlight
              ng-repeat="highlight in highlightsByPage[${this.pageNumber}]"
              highlight="highlight"
              emphasized="emphasizedHighlights[highlight.id]"
              page-number="${this.page.pageNumber}"
              on-mouseenter="onHighlightMouseenter({highlight: highlight, pageNumber: pageNumber})"
              on-mouseleave="onHighlightMouseleave({highlight: highlight, pageNumber: pageNumber})"
            ></pdf-highlight>
          </div>
        `)(this.scope);
        this.element.append(highlightsLayer);

        // add text renderer
        const textElement = angular.element('<div class="ph-pdf-text"></div>');
        this.element.append(textElement);
        this.textRenderer = new TextRenderer(textElement, this.page);

        // add annotations renderer
        const annotationsLayer = angular.element('<div class="ph-pdf-annotations"></div>');
        this.element.append(annotationsLayer);
        this.annotationsRenderer = new AnnotationsRenderer(annotationsLayer, this.page, this.linkService);

        // add popup layer
        const popup = $compile(`
          <pdf-popup
            target="popupTarget"
            page-number="${this.page.pageNumber}"
          ></pdf-popup>
        `)(this.scope);
        this.element.append(popup);

        this.initializedRenderers = true;

        // should the text layer be focused?
        if (this.textFocused) this.textFocus();

        return true;
      }

      // set page element height via css
      // (based on actual page size or default page size)
      updateSize(_width = undefined) {
        const width = _width || this.element[0].offsetWidth;
        const size = this.pageSize || this.defaultPageSize;
        const height = Math.floor(size.height / size.width * width);

        // set new height
        this.element.css({'padding-top': 100 * (height / width) + '%'});
        this.height = height;

        return true;
      }

      onResized() {
        this.scope.onPageResized({
          pageNumber: this.pageNumber,
          displaySize: {
            height: this.height,
            width: this.element.width(),
          },
          originalSize: this.pageSize && {
            height: this.pageSize.viewBox[3],
            width: this.pageSize.viewBox[2],
          },
          offset: {
            top: this.element[0].offsetTop,
            left: this.element[0].offsetLeft,
          }
        });
      }

      onRendered() {
        this.scope.$apply(() => {
          this.scope.onPageRendered({
            pageNumber: this.pageNumber,
          });
        });
      }

      async render() {
        await this.initPageSize();
        await this.initRenderers();

        const {viewport, deviceViewport} = this.getViewport();
        const size = {
          height: deviceViewport.height,
          width: deviceViewport.width,
        };

        // stop if currently rendered size is up to date
        if (isSameSize(this.renderedSize, size)) return false;

        // TODO: cancel renderers
        // this.canvasRenderer.cancel();
        // this.textRenderer.cancel();

        // set rendered viewport (also indicates the viewport that is
        // currently rendered to other render calls)
        this.renderedSize = size;

        try {
          await this.canvasRenderer.render(deviceViewport);
          await this.textRenderer.render(viewport);
          await this.annotationsRenderer.render(viewport);

          this.onRendered();

          return true;
        } catch (error) {
          // return if cancelled
          if (error === 'cancelled') {
            console.log(`page ${this.pageNumber} cancelled`);
            return false;
          }
          throw error;
        }
      }

      textFocus() {
        this.textFocused = true;
        if (this.initializedRenderers) {
          this.annotationsRenderer.element.addClass('ph-no-interaction');
        }
      }

      textUnfocus() {
        this.textFocused = false;
        if (this.initializedRenderers) {
          this.annotationsRenderer.element.removeClass('ph-no-interaction');
        }
      }

      unrender() {
        delete this.canvasRenderer;
        delete this.textRenderer;
        delete this.annotationsRenderer;
        delete this.renderedSize;

        // remove all child elements
        this.element.empty();

        this.initializedRenderers = false;
      }
    }

    // render a full pdf
    class PdfFull {
      pages: Array<PdfPage>;
      renderedPages: Array<PdfPage>;
      renderQueue: any;
      texts: Array<any>;

      containerWidth: number;
      lastSelectors: any;
      lastSimpleSelection: any;
      linkService: LinkService;
      anchor: string;
      textFocused: boolean = false;

      constructor(public pdf: PDFDocumentProxy, public element: JQuery,
          public scope: any) {
        this.pages = [];

        // set up render queue
        this.renderQueue = queue(this.renderPage.bind(this));
        this.renderedPages = [];

        // wipe element children
        this.element.empty();

        this.linkService = new LinkService(scope.onLinkDestCreate, this.scrollToAnchor.bind(this));
      }

      // initialize all pages
      async init() {
        // oh, don't ask why
        if (this.pdf.numPages === 0) {
          console.warn('The PDF has no pages. :(');
          return;
        }

        // container element width
        const width = this.element[0].offsetWidth;

        // get size of first page and use it as a preliminary default size
        const firstPage = await this.pdf.getPage(1);
        const defaultPageSize = firstPage.getViewport(1.0);

        // create pages
        for (let pageNumber = 1; pageNumber <= this.pdf.numPages; pageNumber++) {
          // create page element
          const pageElement =
            angular.element(`<div class="ph-pdf-page" id="p:${pageNumber}"></div>`);
          this.element.append(pageElement);

          // instantiate page
          const page = new PdfPage(this.pdf, pageNumber, pageElement, this.scope, this.linkService, defaultPageSize, width);
          this.pages.push(page);
        }

        // render first page unconditionally
        await this.pages[0].render();
        this.renderedPages = [this.pages[0]];

        // call onResized
        this.scope.$apply(() => this.pages.forEach(page => page.onResized()));

        // re-render on resize and scroll events
        const _resizeRender = () => {
          this.element.addClass('ph-pdf-resize-active');
          this.render();
        };
        const _render = this.render.bind(this);
        angular.element($window).on('resize', _resizeRender);
        angular.element($window).on('scroll', _render);

        // focus text layer on mousedown (except click on links)
        let mousedown = false;
        this.element.on('mousedown', event => {
          if (jquery(event.target).prop('tagName') === 'A') return;
          mousedown = true;
          this.textFocus();
        });
        const onMouseUp = () => {
          mousedown = false;
          this.textUnfocus();
          this.onTextSelect();
        };
        $document.on('mouseup', onMouseUp);

        // focus text layer while ctrl+alt is pressed
        // note: key events are not fired on PDFs
        const onKeyEvent = event => {
          const shouldFocus = event.altKey && event.ctrlKey || event.metaKey;
          if (shouldFocus) this.textFocus();
          else if (!mousedown) {
            this.textUnfocus();
            if (event.type === 'keyup') this.onTextSelect();
          }
        };
        $document.on('keydown keyup', onKeyEvent);

        // unregister event handlers
        this.element.on('$destroy', () => {
          angular.element($window).off('resize', _resizeRender);
          angular.element($window).off('scroll', _render);
          $document.off('mouseup', onMouseUp);
          $document.off('keydown keyup', onKeyEvent);
        });

        this.element.on('mouseup', () => this.textUnfocus());

        // render at least once
        this.render();

        // make sure that all pages have correct size
        await this.resizePages();

        // all pages have correct size
        this.scope.$apply(() => this.scope.onAllPagesResized({}));

        // monitor scrollToAnchor
        this.scope.$watch('scrollToAnchor', this.scrollToAnchor.bind(this));

        // monitor searchPositions
        this.scope.$watch('searchPositions', this.searchPositions.bind(this));

        this.scope.$watchCollection('highlights', this.updateHighlights.bind(this));

        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.updateText();
      }

      async updateText() {
        this.texts = await Promise.all(this.pages.map(page => page.getPageText()));
        this.scope.$apply(() => {
          this.scope.onTextUpdate({
            str: this.texts.join(' ').concat(' '),
            pageLengths: this.texts.map(text => text.length + 1),
          });
        });
      }

      searchPositions(positions) {
        if (!positions) return;

        // store length for each page
        const pageLengths = this.texts.map(text => text.length + 1);

        // sum up all lengths
        let pageOffsets = [0];
        for (let i = 1; i <= pageLengths.length; i++) {
          let sum = pageOffsets[i - 1];
          pageOffsets[i] = pageLengths[i - 1] + sum;
        }

        // store relative position (page offset) and page number
        let pagePositions = [];
        let pageCount = 1;
        for (let i = 0; i < positions.length; i++) {
          // locate page number (offset) of position
          if (positions[i] >= pageOffsets[pageCount - 1] && positions[i] < pageOffsets[pageCount]) {
            // store page offset and page number
            pagePositions.push({
              positionOnPage: positions[i] - pageOffsets[pageCount - 1],
              pageNumber: pageCount,
            });
          } else {
            // if position didn't fit in interval: shift interval and check position again
            pageCount += 1;
            i -= 1;
          }
        }

        for (let i = 1; i <= this.pages.length; i++) {
          const curPagePositions = pagePositions.filter(pagePosition => pagePosition.pageNumber === i);
          this.pages[i - 1].getBoxPositions(curPagePositions);
        }
      }

      destroy() {
        // TODO: release PDFjs resources (canvas, ...)?
      }

      onSelect(selectors) {
        // only call onSelect output if necessary
        if (isEqual(selectors, this.lastSelectors)) return;

        this.lastSelectors = selectors;
        this.scope.onSelect({selectors});
      }

      onTextSelect() {
        // delayed execution of handler
        // (otherwise deselection of text is not detected)
        $timeout(() => {
          this.scope.$apply(() => {
            // get current text selection
            const selection = rangy.getSelection();

            // no selection object or no anchor/focus
            if (!selection || !selection.anchorNode || !selection.focusNode) {
              return this.onSelect(undefined);
            }

            // selection not contained in element?
            if (!rangy.dom.isAncestorOf(this.element[0], selection.anchorNode) ||
                !rangy.dom.isAncestorOf(this.element[0], selection.focusNode)) {
              return this.onSelect(undefined);
            }

            // do not allow collapsed / empty selections
            if (!selection.toString()) {
              return this.onSelect(undefined);
            }

            // do not allow selections with zero or more than one ranges
            // (André: I guess that's possible in crazy browsers)
            if (selection.rangeCount !== 1) {
              return this.onSelect(undefined);
            }

            // do nothing if start and end are equal to last selection
            // NOTE: this currently does not work because getRectanglesSelector
            //       creates new TextNodes in order to measure selections
            const simpleSelection = pick(selection,
              'anchorNode', 'anchorOffset', 'focusNode', 'focusOffset');
            if (isEqual(simpleSelection, this.lastSimpleSelection)) return;
            this.lastSimpleSelection = simpleSelection;

            // split selection ranges into ranges for individual pages
            // TODO: implement O(1) page detection for a range
            const range = selection.getAllRanges()[0];
            const pageRanges = [];
            this.pages.forEach(page => {
              if (!page.textRenderer ||
                  !range.intersectsNode(page.textRenderer.element[0])) return;

              // get range that selects the page's content
              const pageRange = rangy.createRange();
              pageRange.selectNodeContents(page.textRenderer.element[0]);

              // intersect range with page range
              pageRanges.push({
                pageNumber: page.pageNumber,
                range: range.intersection(pageRange),
              });
            });

            const selectors = {
              // text position selector
              // TODO: the global text position selector currently makes no
              //       sense because it requires that the full document
              //       has been rendered. It also runs in O(N) where N is the
              //       total number of characters in the document.
              // textPosition: getTextPositionSelector(range, this.element[0]),

              // text quote selector
              textQuote: getTextQuoteSelector(range, this.element[0]),

              // is this a backwards selection (bottom to top)
              isBackwards: selection.isBackwards(),
            };

            // pdf text positions selector
            selectors.pdfTextQuotes = pageRanges.map(pageRange => {
              const page = this.pages[pageRange.pageNumber - 1];
              const selector = getTextQuoteSelector(pageRange.range, page.textRenderer.element[0]);
              selector.pageNumber = pageRange.pageNumber;
              return selector;
            });

            // pdf text quotes selector
            selectors.pdfTextPositions = pageRanges.map(pageRange => {
              const page = this.pages[pageRange.pageNumber - 1];
              const selector = getTextPositionSelector(pageRange.range, page.textRenderer.element[0]);
              selector.pageNumber = pageRange.pageNumber;
              return selector;
            });

            // pdf rectangles selector
            selectors.pdfRectangles = flatten(pageRanges.map(pageRange => {
              const page = this.pages[pageRange.pageNumber - 1];
              const selectors = getRectanglesSelector(range, page.textRenderer.element[0]);
              selectors.forEach(selector => selector.pageNumber = pageRange.pageNumber);
              return selectors;
            }));

            return this.onSelect(selectors);
          });
        });
      }

      // resize all and render relevant pages
      render(force = false) {
        // remove waiting tasks from queue
        this.renderQueue.kill();

        const newContainerWidth = this.element[0].offsetWidth;

        // resize pages only if the window size changed
        let sizeChanged = this.containerWidth !== newContainerWidth;
        if (sizeChanged) {
          // no page => resize
          this.renderQueue.push(undefined);
        } else {
          this.element.removeClass('ph-pdf-resize-active');
        }

        // get currently running render tasks
        const running = this.renderQueue.workersList().map(task => task.data);

        // detect visible pages
        // TODO: implement O(log(n)) algorithm (bisection!)
        const visiblePages =
          this.pages.filter(page => isVisible(page.element, $window));

        // determine pages that need to be rendered
        let renderPages = clone(visiblePages);

        // add adjacent pages of visible pages
        // (note: pdfjs page numbers are 1-based)
        if (visiblePages.length > 0) {
          const firstPageNumber = visiblePages[0].pageNumber;
          if (firstPageNumber > 1) {
            renderPages.push(this.pages[firstPageNumber - 2]);
          }
          const lastPageNumber = visiblePages[visiblePages.length - 1].pageNumber;
          if (lastPageNumber < this.pages.length) {
            renderPages.push(this.pages[lastPageNumber]);
          }
        }

        // unrender pages (exclude running tasks)
        const unrenderPages = difference(this.renderedPages, running, renderPages);
        unrenderPages.forEach(page => page.unrender());
        this.renderedPages = difference(this.renderedPages, unrenderPages);


        // if not resized: remove pages that are running or already rendered
        if (!force && !sizeChanged) {
          renderPages = difference(renderPages, running, this.renderedPages);
        }

        // add pages to queue
        renderPages.forEach(page => {
          this.renderQueue.push(page, (err, rendered) => {
            // do not update rendered pages if not rendered or already present
            if (!rendered || this.renderedPages.indexOf(page) !== -1) return;

            // update array of rendered pages
            this.renderedPages.push(page);
          });
        });
      }

      async resizePages() {
        // container width
        const width = this.element[0].offsetWidth;

        // wait until all pages initialized their correct size
        const initialized =
          await Promise.all(this.pages.map(page => page.initPageSize(width)));

        // update page size if none have been initialized
        const resized = this.pages.map(page => page.updateSize(width));

        // store last processed size
        this.containerWidth = width;

        // if at least one page has been initialized or resized: wait for DOM
        if (some(initialized) || some(resized)) {
          await new Promise(resolve => $timeout(resolve));

          // call onResized
          this.scope.$apply(() => {
            this.pages.forEach(page => page.onResized());
          });

          // re-evaluate what needs to be rendered and force re-rendering
          this.render(true);
        }

        // remove resize-active class (used for animations)
        this.element.removeClass('ph-pdf-resize-active');
      }

      renderPage(page, callback) {
        // if page is provided: render
        // otherwise: resize all pages
        const promise = page ? page.render() : this.resizePages();

        promise.then(
          rendered => callback(undefined, rendered),
          err => callback(err)
        );
      }

      async scrollToAnchor(anchor) {
        if (!anchor) return;
        if (anchor !== this.anchor) {
          this.anchor = anchor;
          this.scope.onAnchorUpdate({anchor});
        }

        let match;
        // match page
        if (match = /^p:(\d+)$/.exec(anchor)) {
          return this.scrollToId(anchor);
        }
        // match pdf named destination
        if (match = /^pdfd:(.*)$/.exec(anchor)) {
          return await this.scrollToDest(match[1]);
        }
        // match selection anchor
        if (match = /^s:([\w-]+)$/.exec(anchor)) {
          return await this.scrollToSelection(match[1]);
        }
        throw new Error(`Anchor ${anchor} does not match.`);
      }

      scrollToId(id) {
        // get element
        const element = $document[0].getElementById(id);
        if (!element) return;

        // scroll
        scroll.scrollTo(element, {offset: (this.scope.viewportOffsetTop || 0) + 130});
      }

      async scrollToDest(dest) {
        const destRef = await this.pdf.getDestination(dest);
        if (!destRef) throw new Error(`destination ${dest} not found`);
        if (!isArray(destRef)) throw new Error('destination does not resolve to array');

        let top;
        switch (destRef[1].name) {
          case 'XYZ':
            top = destRef[3];
            break;
          case 'FitH':
          case 'FitBH':
            top = destRef[2];
            break;
          case 'FitR':
            top = destRef[5];
            break;
          default:
            console.warn(`destination type ${destRef[1].name} is not supported`);
            return;
        }

        const pageNumber = await this.pdf.getPageIndex(destRef[0]);
        if (!isNumber(pageNumber)) throw new Error('page number invalid');
        if (pageNumber < 0 || pageNumber >= this.pdf.numPages) {
          throw new Error('page number out of bounds');
        }

        if (top === null || top === undefined) {
          console.warn('ignoring destination without coordinates');
          return;
        }
        const page = this.pages[pageNumber];
        if (!page.pageSize) throw new Error('pageSize not available');
        const coords = page.pageSize.convertToViewportPoint(0, top);

        scroll.scrollTo(
          this.element.offset().top +
          page.element[0].offsetTop +
          coords[1] / page.pageSize.height * page.height,
          {offset: (this.scope.viewportOffsetTop || 0) + 130}
        );
      }

      async scrollToSelection(anchorId) {
        const response = await $http.get(`${config.apiUrl}/anchors/${anchorId}`);
        const rects = get(response, 'data.target.selectors.pdfRectangles');
        if (!rects) throw new Error('pdf rectangles missing');

        // get top rect of selection
        const topRect = rects.sort((rectA, rectB) => {
          if (rectA.pageNumber < rectB.pageNumber) return -1;
          if (rectA.pageNumber > rectB.pageNumber) return 1;
          if (rectA.top < rectB.top) return -1;
          if (rectA.top > rectB.top) return 1;
          return 0;
        })[0];

        // get page
        if (topRect.pageNumber > this.pages.length) return; // TODO: error
        const page = this.pages[topRect.pageNumber - 1];

        // scroll
        scroll.scrollTo(
          this.element.offset().top +
          page.element[0].offsetTop +
          topRect.top * page.height,
          {offset: (this.scope.viewportOffsetTop || 0) + 130}
        );

        // set selection
        this.onSelect(response.data.target.selectors);
      }

      textFocus() {
        if (this.textFocused) return;
        this.textFocused = true;
        this.pages.forEach(page => page.textFocus());
      }

      textUnfocus() {
        if (!this.textFocused) return;
        this.textFocused = false;
        this.pages.forEach(page => page.textUnfocus());
      }

      updateHighlights() {
        this.scope.highlightsByPage = {};
        if (!this.scope.highlights) return;

        this.scope.highlights.forEach(highlight => {
          if (!highlight.selectors || !highlight.selectors.pdfRectangles) return;
          const pageNumbers = uniq(highlight.selectors.pdfRectangles.map(rect => rect.pageNumber));
          pageNumbers.forEach(pageNumber => {
            if (!this.scope.highlightsByPage[pageNumber]) {
              this.scope.highlightsByPage[pageNumber] = [];
            }
            this.scope.highlightsByPage[pageNumber].push(highlight);
          });
        });
      }
    }

    return {
      restrict: 'E',
      scope: {
        // Input
        // =====

        // The pdf object (output of the pdf directive)
        pdf: '<',

        // highlights: array of objects
        // interpreted properties: selectors (describes the position)
        //                         emphasize (e.g., if the corresponding margin discussion is hovered)
        highlights: '<',

        // object mapping highlight ids to emphasize state (boolean)
        emphasizedHighlights: '<',

        // TODO: add documentation
        popupTarget: '<',

        scrollToAnchor: '<',

        viewportOffsetTop: '<',

        searchPositions: '<',

        // Output
        // ======

        // all pages are guaranteed to be resized once when initializing;
        // passed arguments: pageNumber,
        //                   offset (top, left relative to offsetParent),
        //                   displaySize (height and width in pixels)
        //                   originalSize (height and width in )
        onPageResized: '&',
        onAllPagesResized: '&',

        // pages are rendered on demand;
        // passed arguments: pageNumber
        onPageRendered: '&',
        onPageUnrendered: '&',

        /* TODO: do we need this?
        // highlights are rendered after the page has been rendered
        // passed arguments: highlight
        //                   position (top, left relative to viewport),
        //                   size (properties width, height)
        onHighlightRendered: '&',
        onHighlightUnrendered: '&',
        */

        // called when hovering over rendered highlights
        // passed arguments: highlight
        // TODO: fix event propagation issue
        onHighlightMouseenter: '&',
        onHighlightMouseleave: '&',

        // called when text is selected (TODO: select arbitrary rectangles)
        // passed arguments: selector
        //                   position (top, left relative to viewport),
        //                   size (properties width, height)
        onSelect: '&',

        // called when an in-document link is created; should return the URL
        onLinkDestCreate: '&',

        // called when the anchor is updated
        onAnchorUpdate: '&',

        onTextUpdate: '&',
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
          pdfFull = new PdfFull(pdf, element, scope);
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
