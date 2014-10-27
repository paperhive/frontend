(function(){
  var app = angular.module('paperHub', []);

  app.controller('DisplayController', function() {
    this.display = {};
    // 'use strict';
    var url = '';

    this.fetchPdf = function() {
      console.log(this.url);
      // Fetch the PDF document from the URL using promises
      PDFJS.getDocument(this.url).then(
        function(pdf) {
          // Using promise to fetch the page
          pdf.getPage(1).then(function(page) {
            var scale = 1.0;
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
