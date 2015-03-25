'use strict';
module.exports = function(app) {
  app.run([
    '$rootScope', '$routeSegment',
    function(
      $rootScope, $routeSegment
    ) {
      $rootScope.$on('routeSegmentChange', function() {
        var title =
          $routeSegment.chain[$routeSegment.chain.length - 1].params.title;
        if (title) {
          $rootScope.pageTitle = title;
        }
      });
    }
  ]);
};
