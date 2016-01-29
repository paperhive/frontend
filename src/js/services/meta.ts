'use strict';
import angular = require('angular');
// module.exports = function(app) {
export = function(app) {
  app.factory(
    'metaService',
    [
      function() {
        const service = {
          data: {}
        };
        service.set = function(newData) {
          angular.copy(newData, service.data);
        };
        return service;
      }
    ]);
};
