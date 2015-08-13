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
      templateUrl: 'templates/directives/attribution.html'
    };
  }]);

};
