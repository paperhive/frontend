export default function(app) {
  app.factory('returnPathService', ['$rootScope', '$location',
    function($rootScope, $location) {
      const returnPathService = {};

      function setReturnPath() {
        if ($location.path() !== '/signup' && $location.path() !== '/login') {
          returnPathService.returnPath = $location.path();
        }
        if (!returnPathService.returnPath) {
          returnPathService.returnPath = $location.search().returnPath || '/';
        }
      }
      setReturnPath();
      $rootScope.$on('$locationChangeSuccess', setReturnPath);

      return returnPathService;
    }
  ]);
}