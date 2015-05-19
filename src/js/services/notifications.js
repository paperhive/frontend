'use strict';
module.exports = function(app) {
  app.factory('notificationService', [
    function() {
      var service = {
        notifications: []
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
