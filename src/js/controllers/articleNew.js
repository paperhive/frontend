module.exports = function (app) {
  app.controller('ArticleNewCtrl', [
    '$scope', '$http', 'config', 'authService',
    function($scope, $http, config, authService) {
      $scope.$watch('handle', function (handle) {
        $http.get(config.api_url + '/articles/external/' +
                  encodeURIComponent(handle))
          .success(function (metadata) {
            $scope.metadata = metadata;
          })
          .error(function () {
            $scope.metadata = undefined;
          });
      });
    }
  ]);
};
