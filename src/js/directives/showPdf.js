module.exports = function (app) {
  app.directive('pdf', [function () {
    return {
      restrict: 'E',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        scope.$watch(
          function () {
            return ngModel.$modelValue;
          },
          function(url) {
            if (url === undefined) {
              return;
            }

            // From
            // <https://github.com/mozilla/pdf.js/blob/master/examples/components/simpleviewer.js>.
            if (!PDFJS.PDFViewer || !PDFJS.getDocument) {
              alert('Please build the library and components using\n' +
                    '  `node make generic components`');
            }

            var container = document.createElement("div");
            container.id = "container";
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
            PDFJS.getDocument(url).then(function (pdfDocument) {
              // Document loaded, specifying document for the viewer.
              pdfViewer.setDocument(pdfDocument);
            });
            // ================================================================
          }
        );
      }
    };
  }]);
};
