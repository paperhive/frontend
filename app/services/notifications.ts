export default function(app) {
  app.factory('notificationService', ['$rootScope',
    function($rootScope) {

      const service = {
        notifications: [],
        httpError: undefined,
      };

      service.httpError = function(msg) {
        return function(data) {
          service.notifications.push({
            type: 'error',
            message: (data && data.message) || msg || 'unknown error',
          });
        };
      };

      // remove notifications if route changes
      $rootScope.$on('$routeChangeSuccess', function(event, newRoute, oldRoute) {
        const oldPath = oldRoute && oldRoute.$$route.originalPath;
        // filter redirect after first sign-up
        if (oldPath !== '/authReturn') {
          service.notifications.splice(0, service.notifications.length);
        }
      });

      return service;
    },
  ]);
};
