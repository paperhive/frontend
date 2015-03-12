'use strict';
module.exports = function (app) {
  app.controller('ArticleNewCtrl', [
    '$scope', '$http', '$q', '$location', 'config', 'authService',
    'notificationService',
    function($scope, $http, $q, $location, config, authService,
             notificationService) {
      $scope.check = {};

      $scope.submitApproved = function () {
        $scope.submitting = true;
        $http.post(config.api_url + '/articles/sources', undefined, {
          params: {handle: $scope.handle},
        })
          .success(function (article) {
            $scope.submitting = false;
            $location.path('/articles/' + article._id);
          })
          .error(function (data) {
            $scope.submitting = false;
            notificationService.notifications.push({
              type: 'error',
              message: data.message || 'could not add article (unknown reason)'
            });
          });

      };
    }
  ]);
};
