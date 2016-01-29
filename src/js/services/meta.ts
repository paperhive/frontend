'use strict';
import angular = require('angular');
// export default function(app) {
export default function(app) {
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
