'use strict';
var _ = require('lodash');
var PDFJS = require('pdfjs');

module.exports = function (app) {
  app.directive('pdf', ['$parse', function ($parse) {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.$watchGroup(['pdfUrl', 'pdfTextOverlay'], renderPdf);

        function renderPdf () {
          var url = scope.$eval(attrs.pdfUrl);
          var textOverlay = scope.$eval(attrs.pdfTextOverlay);

          var progress = {
            downloading: false,
            rendering: false,
            finished: false,
            numPages: undefined,
            numRenderedPages: undefined
          };
          var progressParsed = $parse(attrs.pdfProgress);
          if (progressParsed && progressParsed.assign) {
            progressParsed.assign(scope, progress);
          }

          if (!url) return;

          // From
          // <https://github.com/mozilla/pdf.js/blob/master/examples/components/simpleviewer.js>.

          if (!textOverlay) {
            // Simple viewer without any overlays.

            // Fetch the PDF document from the URL using promises
            PDFJS.getDocument(url).then(function (pdf) {
              var wrapperWidth = element[0].offsetWidth;
              if (wrapperWidth === 0) {
                // TODO make sure this error doesn't get silently intercepted
                throw Error("Invalid wrapper width");
              }

              var showPage = function(page) {
                // Scale such that the width of the viewport is the fills the
                // wrapper.
                var scale = 1.0;
                var viewport = page.getViewport(scale);
                scale = wrapperWidth / viewport.width;
                viewport = page.getViewport(scale);

                // Prepare canvas using PDF page dimensions
                var link = document.createElement("a");
                // From <http://stackoverflow.com/a/14717011/353337>
                // link.setAttribute("href", "#/articles/0af5e13/text?scrollTo=pageContainer".concat(page.pageIndex+1));
                //
                // TODO: solve this outside the pdf directive
                link.setAttribute("href", "#/articles/0af5e13/text");
                var canvas = document.createElement("canvas");
                canvas.setAttribute("class", "ph-page");
                link.appendChild(canvas);

                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                var renderContext = {
                  canvasContext: context,
                  viewport: viewport
                };
                page.render(renderContext);
                // Append to page
                element.append(link);
              };

              for(var i = 1; i < pdf.numPages; i++){
                // Using promise to fetch the page
                pdf.getPage(i).then(showPage);
              }

              // TODO: call onLoaded
            });
          } else {
            // Complex viewer with bells & whistles
            var pdfViewer = new PDFJS.PDFViewer({
              // use element as container and viewer element
              // (container is only used for size measurements and events)
              container: element[0],
              viewer: element[0]
            });

            // set scale
            element[0].addEventListener('pagesinit', function () {
              pdfViewer.currentScaleValue = 'page-width';
            });


            // load document
            progress.downloading = true;
            PDFJS.getDocument(url).then(function (pdf) {

              // update progress when a page has been rendered
              progress.renderedPages = [];
              element[0].addEventListener('pagerendered', function (e) {
                // normalize the DOM subtree of the rendered page
                // (otherwise serialized ranges may be based on different
                // DOM states)
                e.target.normalize();

                scope.$apply(function () {
                  progress.renderedPages.push(e.detail.pageNumber);

                  // fire onLoaded if last page has been rendered
                  if (progress.renderedPages.length === pdf.numPages) {
                    _.assign(progress, {
                      rendering: false,
                      finished: true
                    });
                  }
                  });
              });

              // document loaded, specifying document for the viewer
              pdfViewer.setDocument(pdf);

              scope.$apply(function () {
                _.assign(progress, {
                  downloading: false,
                  rendering: true,
                  numPages: pdf.numPages,
                });
              });
            });

            // --------------------------------------------------------------------
            //// Get text width
            //pdf.then(function(pdf) {
            //  var maxPages = pdf.pdfInfo.numPages;
            //  maxPages = 1;
            //  for (var j = 1; j <= maxPages; j++) {
            //    var page = pdf.getPage(j);
            //    page.then(function(page) {
            //      var textContent = page.getTextContent();
            //      var viewport = page.getViewport(pdfViewer.currentScale);
            //      textContent.then(function(content) {
            //        for (var i = 0; i < content.items.length; i++) {
            //          // Well...

            //          // Check out the discussion at
            //          // https://github.com/mozilla/pdf.js/issues/5643#issuecomment-69969258
            //          // for more details.
            //          console.log('');
            //          // Translate PDF transform into the screen presentation
            //          // transform
            //          //console.log(viewport.transform);
            //          //console.log(content.items[i].transform);
            //          tx = PDFJS.Util.transform(
            //            viewport.transform,
            //            content.items[i].transform
            //          );
            //          var fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
            //          //console.log(tx[2]);
            //          //console.log(tx[3]);
            //          //console.log(fontHeight);
            //          // The transformation matrix is specified as an array of
            //          // length 6 just like CSS3 transforms, cf.
            //          // <https://dev.opera.com/articles/understanding-the-css-transforms-matrix/>.
            //          console.log(content.items[i]);
            //          // x-position of the top-right point
            //          var extent = tx[4];
            //          //  tx[0] * content.items[i].width/fontHeight +
            //          //  tx[4];
            //          console.log("tx[4] = ", extent);
            //          var actualWidth = pdfViewer.currentScale * content.items[i].width;
            //        }
            //      })
            //    })
            //  }
            //});
            // --------------------------------------------------------------------

            // --------
            //var container = document.createElement("div");
            //container.id = "container";
            //element.append(container);

            //// Loading document.
            //var PAGE_TO_VIEW = 1;
            //var SCALE = 1.0;
            //PDFJS.getDocument(scope.url).then(function (pdfDocument) {
            //  // Document loaded, retrieving the page.
            //  return pdfDocument.getPage(PAGE_TO_VIEW).then(function (pdfPage) {
            //    // Creating the page view with default parameters.
            //    var pdfPageView = new PDFJS.PDFPageView({
            //      container: container,
            //      id: PAGE_TO_VIEW,
            //      scale: SCALE,
            //      defaultViewport: pdfPage.getViewport(SCALE),
            //      // We can enable text/annotations layers, if needed
            //      textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
            //      annotationsLayerFactory: new PDFJS.DefaultAnnotationsLayerFactory()
            //    });
            //    // Associates the actual page with the view, and drawing it
            //    pdfPageView.setPdfPage(pdfPage);
            //    return pdfPageView.draw();
            //  });
            //});
            //// --------
          }
        }
      }
    };
  }]);
};
