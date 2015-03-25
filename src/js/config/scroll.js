'use strict';
module.exports = function(app) {
  app.run([
    '$rootScope', '$location', '$anchorScroll', '$routeParams', '$route',
    '$routeSegment',
    function($rootScope, $location, $anchorScroll, $routeParams, $route,
             $routeSegment) {
      // add scroll handler on route change
      // http://stackoverflow.com/questions/14712223/how-to-handle-anchor-hash-linking-in-angularjs
      $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
        //$location.hash($routeParams.scrollTo);
        $anchorScroll();

        //Change page title, based on Route information
        //$rootScope.title = $route.current.title;
        //console.log($route.current.title);
        //console.log($route);
        //console.log($routeSegment);
        //console.log($routeSegment.chain);
      });
    }
  ]);
};
