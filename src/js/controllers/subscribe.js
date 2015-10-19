'use strict';

module.exports = function(app) {

  app.controller('SubscribeCtrl', ['$scope', '$http', 'config',
    function($scope, $http, config) {
      $scope.submit = function() {
        $scope.submitting = true;
        $scope.error = undefined;
        $http.post(config.apiUrl + '/newsletter/', {email: $scope.email})
          .then(function(response) {
            $scope.submitting = false;
          }, function(response) {
            $scope.submitting = false;
            $scope.error = response.data && response.data.message ||
              'Unknown error';
          });

      };
    }
  ]);

};
