(function(){
  var app = angular.module('paperHub', ['ui.bootstrap', 'ngSanitize', 'btford.markdown', 'paperhub.markdown']);

  //// http://stackoverflow.com/questions/16087146/getting-mathjax-to-update-after-changes-to-angularjs-model
  MathJax.Hub.Config({
    skipStartupTypeset: true,
    messageStyle: "none",
    "HTML-CSS": {
      showMathMenu: false
    }
  });
  MathJax.Hub.Configured();

  app.directive("mathjaxBind", function() {
    return {
      restrict: "A",
      scope:{
        text: "@mathjaxBind"
      },
      controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
        $scope.$watch('text', function(value) {
          var $script = angular.element("<script type='math/tex'>")
          .html(value === undefined ? "" : value);
          console.log('gg', $script);
          console.log('gg', $element, $element.toString());
          console.log('gg', $element[0]);
          $element.html("");
          $element.append($script);
          console.log('ee', $element[0]);
          MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
        });
      }]
    };
  });
  app.directive('mymathjax', function ($compile) {
    return {
      require: "ngModel",
      restrict: 'A',
      priority: 5,
      replace: true,
      link: function (scope, element, attrs, ngModel) {
        scope.$watch(
          // Watch the contents of the model for change
          function() {return ngModel.$modelValue;},
          function(modelValue) {
            // TODO intercept the case of empty html
            console.log('xx', modelValue);
            //modelValue = modelValue.replace(/\$\$([^$]+)\$\$/g, "<span style='display:block' mathjax-bind=\"$1\"></span>");
            //modelValue = modelValue.replace(/\$([^$]+)\$/g, "<div style='display:inline-block' mathjax-bind=\"$1\"></div>");
            //modelValue = modelValue.replace(/\$([^$]+)\$/g, "<div style='color:green'>GO GO</div>");
            modelValue += "Test";
            console.log('XX', modelValue);
            element.html(modelValue);
            //$compile(element.contents())(scope);
          });
      }
    };
  });
  app.directive('mymarkdown', function ($compile) {
    return {
      require: "ngModel",
      restrict: 'A',
      priority: 10,
      replace: true,
      link: function (scope, element, attrs, ngModel) {
        scope.$watch(
          function() {return ngModel.$modelValue;},
          function(modelValue) {
            modelValue += "2";
            element.html(modelValue);
          });
      }
    };
  });
  //app.directive("btnCheckbox", function(){
  //  return {
  //    require: "ngModel",
  //    replace: true,
  //    link: function(scope, element, attr, ngModel){
  //      console.log("YES");
  //      scope.$watch(
  //        function() {return ngModel.$modelValue;},
  //        function(modelValue) {
  //          console.log('MODEL', modelValue);
  //        });
  //    }
  //  };
  //});


  app.controller('IssueController', function() {
  });

  app.controller('DisplayController', function() {
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
