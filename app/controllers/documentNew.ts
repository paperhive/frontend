'use strict';
export default function(app) {
  app.controller('DocumentNewCtrl', [
    '$scope', '$http', '$q', '$location', 'config', 'authService',
    'notificationService',
    function($scope, $http, $q, $location, config, authService,
             notificationService) {
      $scope.check = {};

      $scope.submitApproved = function() {
        $scope.submitting = true;
        $http.post(config.apiUrl + '/documents/', undefined, {
          params: {url: $scope.handle}
        })
          .success(function(document) {
            $scope.submitting = false;
            $location.path('/documents/' + document.id);
          })
          .error(function(data) {
            $scope.submitting = false;
            notificationService.notifications.push({
              type: 'error',
              message: (data && data.message) ||
                'could not add document (unknown reason)'
            });
          });

      };
    }
  ]);
};
