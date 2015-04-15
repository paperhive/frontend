'use strict';
module.exports = function(app) {
  app.run([
    '$rootScope', '$routeSegment', 'metaService',
    function(
      $rootScope, $routeSegment, metaService
    ) {
      // event listener for title change
      $rootScope.$on('routeSegmentChange', function(event, current, previous) {
        if ($routeSegment.chain &&
            $routeSegment.chain[$routeSegment.chain.length - 1] &&
            $routeSegment.chain[$routeSegment.chain.length - 1].params.title
           ) {
          metaService.set({
            title:
            $routeSegment.chain[$routeSegment.chain.length - 1].params.title ||
            'PaperHive'
          });
        }
      });
    }
  ]);
};
