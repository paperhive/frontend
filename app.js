(function(){
  var app = angular.module('paperHub', []);

  app.controller('DisplayController', function() {
    this.display = {};
    // 'use strict';
    var url = 'http://arxiv.org/pdf/1208.0264v3.pdf';

    this.fetchPdf = function() {
      console.log(url);
      // Fetch the PDF document from the URL using promises
      PDFJS.getDocument(url).then(
        function(pdf) {
          // Using promise to fetch the page
          pdf.getPage(1).then(function(page) {
            var scale = 0.5;
            var viewport = page.getViewport(scale);

            // Prepare canvas using PDF page dimensions
            var canvas = document.getElementById('the-canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
              canvasContext: context,
            viewport: viewport
            };
            page.render(renderContext);
          });
        });
    };
  });
}
)();
