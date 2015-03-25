'use strict';
module.exports = function(app) {
  app.run([
    '$rootScope', '$location', '$anchorScroll', '$routeParams', '$route',
    function(
      $rootScope, $location, $anchorScroll, $routeParams, $route
    ) {
      // add scroll handler on route change
      // http://stackoverflow.com/questions/14712223/how-to-handle-anchor-hash-linking-in-angularjs
      $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
        //$location.hash($routeParams.scrollTo);
        $anchorScroll();
      });
    }
  ]);
};
