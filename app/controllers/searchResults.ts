'use strict';

export default function(app) {
  app.controller('SearchResultsCtrl', ['$scope', '$location', '$routeParams', '$http', 'config', '$routeSegment',
    function($scope, $location, $routeParams, $http, config, $routeSegment) {

      $scope.limit = 10;

      $scope.query = $location.search().param;
      $scope.$on('$locationChangeSuccess', function() {
        $scope.query = $location.search().param;
        $scope.documents = undefined;
      });

      function getSearchResults(query, limit) {
        return $http.get(config.apiUrl + '/documents/', {
          params: {q: query, limit: limit, restrictToLatest: true}
        })
        .then(
          function(response) {
            return $scope.documents = response.data.documents;
          },
          function(response) {
            notificationService.notifications.push({
              type: 'error',
              message: 'Could not fetch documents'
            });
          }
        );
      };

      $scope.$watchGroup(['query', 'limit'], (newValues) =>
        getSearchResults(newValues[0], newValues[1])
      );

      $scope.totalItems = 64;
      $scope.currentPage = 4;

    }
  ]);
};