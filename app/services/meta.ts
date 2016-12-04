import angular from 'angular';

export default function(app) {
  app.factory('metaService', ['$rootScope', function($rootScope) {
    const service = {
      data: {},
      set: undefined,
    };
    $rootScope.metaService = service;

    service.set = function(newData) {
      angular.copy(newData, service.data);
    };
    return service;
  }]);
};
