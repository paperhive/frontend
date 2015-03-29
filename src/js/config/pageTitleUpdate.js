'use strict';
module.exports = function(app) {
  app.run([
    '$rootScope', '$routeSegment',
    function(
      $rootScope, $routeSegment
    ) {

      // helper function to set the title
      $rootScope.page = {
        setTitle: function(title) {
          this.title = title;
        }
      };

      // event listener for title change
      $rootScope.$on('routeSegmentChange', function(event, current, previous) {
        event.targetScope.$watch('pageTitle', function(value) {
          $rootScope.page.setTitle(value);
        });
        //$rootScope.page.setTitle(
        //  $routeSegment.chain[$routeSegment.chain.length - 1].params.title ||
        //  'PaperHub'
        //);
      });
    }
  ]);
};
