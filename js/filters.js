(function(){
  'use strict';

  angular.module('paperhub.markdown', ['ngSanitize']).
    provider('markdownConverter', function () {
    var opts = {};
    return {
      config: function (newOpts) {
        opts = newOpts;
      },
      $get: function () {
        return new Showdown.converter(opts);
      }
    };
  }).
    directive('phmarkdown', function ($sanitize, markdownConverter) {
    return {
      require: 'ngModel',
      priority: 10,
      restrict: 'A',
      link: function (scope, element, attrs, ngModel) {
        scope.$watch(
          function() {return ngModel.$modelValue;},
          function (newVal) {
            console.log("RR", newVal);
            var html = newVal ? $sanitize(markdownConverter.makeHtml(newVal)) : '';
            console.log("RS", html);
            element.html(html);
          });
      }
    };
  });
})();
