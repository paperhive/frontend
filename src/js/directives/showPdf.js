var PDFJS = require('pdfjs');

module.exports = function (app) {
  app.directive('pdf', function () {
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
          // Fetch the PDF document from the URL using promises
          PDFJS.getDocument(url).then(
            function(pdf) {
            var wrapperWidth = element[0].offsetWidth;

            var showPage = function(page) {
              // Scale such that the width of the viewport is the fills the
              // wrapper.
              var scale = 1.0;
              var viewport = page.getViewport(scale);
              scale = wrapperWidth / viewport.width;
              viewport = page.getViewport(scale);

              // Prepare canvas using PDF page dimensions
              //var canvas = document.getElementById('the-canvas');
              var canvas = document.createElement("canvas");

              canvas.style.cssText = "border:1px solid black;";
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
              element.append(canvas);
            };

            for(var i = 0; i < pdf.numPages; i++){
              // Using promise to fetch the page
              pdf.getPage(i).then(showPage);
            }
          });
        });
      }
    };
  });
};
