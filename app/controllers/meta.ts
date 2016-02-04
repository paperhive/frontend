'use strict';
export default function(app) {

  app.controller('MetaCtrl', [
    '$scope', 'metaService',
    function(
      $scope, metaService
    ) {
      $scope.metaService = metaService;
    }]);
};
