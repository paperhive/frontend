'use strict';
export default function(app) {
  app.controller('HiversCtrl', [
    '$scope', '$rootScope', '$routeSegment', 'config', '$http',
    'notificationService', 'authService',
    function(
      $scope, $rootScope, $routeSegment, config, $http,
      notificationService, authService
    ) {
      const documentId = $routeSegment.$routeParams.documentId;

      if (!documentId) { return; }

      $http.get(
        config.apiUrl + '/documents/' + documentId + '/hivers'
      )
      .success(function(data) {
        $scope.hivers = data.hivers;
      })
      .error(function(err) {
        console.error(err);
        notificationService.notifications.push({
          type: 'error',
          message: err.data.message ? err.data.message :
            'could not fetch hivers (unknown reason)'
        });
      });
    }
  ]);
};
