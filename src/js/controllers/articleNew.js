module.exports = function (app) {
  app.controller('ArticleNewCtrl', [
    '$scope', '$http', '$q', '$location', 'config', 'authService',
    'NotificationsService',
    function($scope, $http, $q, $location, config, authService,
             NotificationService) {
      // used to cancel running http requests
      var canceler;

      $scope.$watch('handle', function (handle) {
        $scope.article = undefined;

        // collapse metadata panel (nothing to view!)
        $scope.metadataCollapsed = true;

        if (handle) {
          // cancel running http request
          if (canceler) {
            canceler.resolve();
          }

          // initiate http request
          canceler = $q.defer();
          $http.get(
            config.api_url + '/articles/external/' + encodeURIComponent(handle),
            {timeout: canceler.promise}
          )
            .success(function (article) {
              $scope.article = article;
            })
            .error(function () {
              $scope.article = undefined;
            });
        }
      });

      $scope.submitApproved = function () {
        $scope.submitting = true;
        $http.post(
          config.api_url + '/articles/external/' +
          encodeURIComponent($scope.handle)
        )
          .success(function (article) {
            $scope.submitting = false;
            $location.path('/articles/' + article._id);
          })
          .error(function (data) {
            $scope.submitting = false;
            NotificationsService.notifications.push({
              type: 'error',
              message: data.message || 'could not add article (unknown reason)'
            });
          });

      };
    }
  ]);
};
