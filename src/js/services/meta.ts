import * as angular from 'angular';
export default function(app) {
  app.factory(
    'metaService',
    [
      function() {
        const service = {
          data: {},
          set: undefined,
        };
        service.set = function(newData) {
          angular.copy(newData, service.data);
        };
        return service;
      }
    ]);
};
