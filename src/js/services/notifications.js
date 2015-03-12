module.exports = function (app) {
  'use strict';

  app.factory('notificationService', [
    function () {
      var service = {
        notifications: []
      };
      service.httpError = function (msg) {
        return function (data) {
          service.notifications.push({
            type: 'error',
            message: data.message ? data.message : msg || 'unknown error'
          });
        };
      };
      return service;
    }
  ]);
};
