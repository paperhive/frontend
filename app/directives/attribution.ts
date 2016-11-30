export default function(app) {
  app.directive('attribution', [
    '$templateCache', '$compile', '$timeout',
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
        templateUrl: 'html/directives/attribution.html'
      };
    }]);
};
