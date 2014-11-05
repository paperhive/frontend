var kramed = require('kramed');
var MathJax = require('MathJax');

module.exports = function (app) {
  app.directive('kramjax', function ($sanitize) {
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
};
