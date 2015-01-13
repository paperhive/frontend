module.exports = function (app) {
  app.directive('pdf', [function () {
    return {
      restrict: 'E',
      scope: {
        'url': '@',
        'offsetPx': '='
      },
      link: function (scope, element, attrs) {
        if (scope.url === undefined) {
          return;
        }

        // From
        // <https://github.com/mozilla/pdf.js/blob/master/examples/components/simpleviewer.js>.
        if (!PDFJS.PDFViewer || !PDFJS.getDocument) {
          alert('Please build the library and components using\n' +
                '  `node make generic components`');
        }

        var container = document.createElement("div");
        container.id = "pdfContainer";
        var viewer = document.createElement("div");
        viewer.id = "viewer";
        viewer.className = "pdfViewer";
        container.appendChild(viewer);

        element.append(container);

        var pdfViewer = new PDFJS.PDFViewer({
          container: container
        });

        container.addEventListener('pagesinit', function () {
          // we can use pdfViewer now, e.g. let's change default scale.
          pdfViewer.currentScaleValue = 'page-width';
        });

        // Loading document.
        PDFJS.getDocument(scope.url).then(function (pdfDocument) {
          // Document loaded, specifying document for the viewer.
          pdfViewer.setDocument(pdfDocument);
        });
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

        // Intercept mouseup event to display new annotation box
        element.on('mouseup', function(event) {
          // Get selected text, cf.
          // <http://stackoverflow.com/a/5379408/353337>.
          var text = "";
          if (window.getSelection) {
            text = window.getSelection().toString();
          } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
          }

          if (text === "") {
            scope.offsetPx = undefined;
          } else {
            // Get vertical offset of the selection.
            if (window.getSelection) {
              selection = window.getSelection();
              // Collect all offsets until we are at the same level as the
              // element in which the annotations are actually displayed (the
              // annotation column). This is ugly since it makes assumptions
              // about the DOM tree.
              // TODO revise
              totalOffset =
                ( selection.anchorNode.parentElement.offsetTop +
                selection.anchorNode.parentElement.parentElement.offsetTop +
                selection.anchorNode.parentElement.parentElement.parentElement.offsetTop
                );
              scope.offsetPx = totalOffset + "px";
            } else if (document.selection && document.selection.type != "Control") {
              scope.offsetPx = document.selection.createRange() + "px";
            }
          }
          scope.$apply();
        });
      }
    };
  }]);
};
