'use strict';
export default function(app) {
  app.controller('StarsCtrl', [
    '$scope', '$rootScope', '$routeSegment', 'config', '$http',
    'notificationService', 'authService',
    function(
      $scope, $rootScope, $routeSegment, config, $http,
      notificationService, authService
    ) {
      console.log('StarsCtrl');
      const documentId = $routeSegment.$routeParams.documentId;
      console.log(documentId);

      if (!documentId) { return; }

      $http.get(
        config.apiUrl + '/documents/' + documentId + '/stars'
      )
      .success(function(data) {
        console.log(data);
        $scope.stars = data.stars;
      })
      .error(function(err) {
        console.error(err);
        notificationService.notifications.push({
          type: 'error',
          message: err.data.message ? err.data.message :
            'could not fetch stars (unknown reason)'
        });
      });
    }
  ]);
};
