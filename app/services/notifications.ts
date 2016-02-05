'use strict';
export default function(app) {
  app.factory('notificationService', [
    function() {
      const service = {
        notifications: [],
        httpError: undefined,
      };
      service.httpError = function(msg) {
        return function(data) {
          service.notifications.push({
            type: 'error',
            message: (data && data.message) || msg || 'unknown error'
          });
        };
      };
      return service;
    }
  ]);
};
