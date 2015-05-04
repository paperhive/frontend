'use strict';
module.exports = function(app) {
  app.run([
    '$rootScope', '$routeSegment', 'metaService',
    function(
      $rootScope, $routeSegment, metaService
    ) {
      // event listener for title change
      $rootScope.$on('routeSegmentChange', function(event, current, previous) {
        var params = $routeSegment.chain &&
          $routeSegment.chain[$routeSegment.chain.length - 1] &&
          $routeSegment.chain[$routeSegment.chain.length - 1].params;
        metaService.set({
          title: params.title || 'PaperHive',
          description: params.description,
          statusCode: params.statusCode || 200
        });
      });
    }
  ]);
};
