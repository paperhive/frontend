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
          throw new Error(msg);
        };
      };

      return service;
    },
  ]);
};
