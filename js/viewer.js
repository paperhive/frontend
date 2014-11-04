(function(){
  var paperhub = angular.module('paperHub', ['ui.bootstrap', 'ngSanitize']);

  MathJax.Hub.Config({
    skipStartupTypeset: true,
    messageStyle: "none",
    "HTML-CSS": {
      showMathMenu: false
    },
    extension: ["Safe.js"]
  });
  MathJax.Hub.Configured();

  paperhub.directive('kramjax', function ($sanitize) {
    var renderer = new kramed.Renderer();
    var orig_renderer = renderer.math;
    renderer.math = function (content, language, display) {
      if (display) {
        return '<div class="mathjax">' + content + '</div>';
      } else {
        return '<span class="mathjax">' + content + '</span>';
      }
    };

    return {
      restrict: 'E',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        scope.$watch(
          function () {
            return ngModel.$modelValue;
          },
          function(newValue){
            try {
              element.html($sanitize(kramed(newValue, {renderer: renderer})));
              // replace span/div tags with script tags
              $(element[0]).find('.mathjax').forEach(function (el) {
                $(el).replaceWith(orig_renderer(
                  $(el).text(), 'math/tex', $(el).prop('tagName')==='DIV'
                ));
              });
              MathJax.Hub.Queue(["Typeset", MathJax.Hub, element[0]]);
            } catch (e) {
              console.log('Error: ' + e);
            }
          }
        );
      }
    };
  });


  paperhub.controller('IssueController', function() {
  });

  paperhub.controller('DisplayController', function() {
    this.display = {};
    // 'use strict';
    var url = '';

    this.fetchPdf = function() {
      console.log(this.url);
      // Fetch the PDF document from the URL using promises
      PDFJS.getDocument(this.url).then(
        function(pdf) {
        var canvasWrapper = document.getElementById('the-canvas-wrapper');
        var wrapperWidth = canvasWrapper.offsetWidth;
        var showPage = function(page) {
          // Scale such that the width of the viewport is the fills the
          // wrapper.
          var scale = 1.0;
          var viewport = page.getViewport(scale);
          scale = wrapperWidth / viewport.width;
          viewport = page.getViewport(scale);

          // Prepare canvas using PDF page dimensions
          //var canvas = document.getElementById('the-canvas');
          var canvas = document.createElement( "canvas" );

          //canvas.style.display = "block";
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
          //document.body.appendChild( canvas );
          canvasWrapper.appendChild(canvas);
        };

        for(var i = 0; i < pdf.numPages; i++){
          // Using promise to fetch the page
          pdf.getPage(i).then(showPage);
        }
      });
    };
  });
}
)();
