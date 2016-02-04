'use strict';
export default function(app) {
  app.controller('ArticleNewCtrl', [
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
          .success(function(article) {
            $scope.submitting = false;
            $location.path('/articles/' + article.id);
          })
          .error(function(data) {
            $scope.submitting = false;
            notificationService.notifications.push({
              type: 'error',
              message: (data && data.message) ||
                'could not add article (unknown reason)'
            });
          });

      };
    }
  ]);
};
