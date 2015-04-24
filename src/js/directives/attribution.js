'use strict';
module.exports = function(app) {

  app.directive('attribution', ['$templateCache', '$compile', '$timeout',
                function($templateCache, $compile, $timeout) {
    return {
      scope: {
        attributionName: '@',
        attributionUrl: '@',
        licenseName: '@',
        licenseUrl: '@',
        workName: '@',
        workUrl: '@'
      },
      templateUrl: 'templates/directives/attribution.html',
      link: function(scope, element, attr) {
        var tooltip = $templateCache.get(
          'templates/directives/attributionTooltip.html'
        );
        var compiledTooltip = $compile(tooltip);

        // watch for changes in input and set body accordingly
        scope.$watchGroup(
          [
            'attributionName', 'attributionUrl',
            'licenseName', 'licenseUrl',
            'workName', 'workUrl'
          ],
          function() {
            // compile html
            var linkedTooltip = compiledTooltip(scope);
            // wait until digest is complete
            $timeout(function() {
              // set body and invoke $apply
              scope.$apply(function() {
                scope.body = linkedTooltip.html();
              });
            });
          }
        );
      }
    };
  }]);

};
