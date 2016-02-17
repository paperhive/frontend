'use strict';

export default function(app) {
  app.controller('SearchResultsCtrl', ['config', '$http', '$location', '$scope', 'notificationService',
    function(config, $http, $location, $scope, notificationService) {
      const maxPerPage = 10;

      $scope.search = {
        page: 1,
        maxSize: 7,
      };

      // update scope variables from location
      function updateFromLocation() {
        $scope.search.query = $location.search().query;
        $scope.search.page = $location.search().page || 1;
        console.log($scope.search.query);
      }
      updateFromLocation();
      $scope.$on('$locationChangeSuccess', updateFromLocation);

      // update location from scope variables
      function updateFromScope(page) {
        $location.search({query: $scope.search.query, page: page});
      }
      $scope.$watch('search.page', updateFromScope);

      function getSearchResults(query, page) {
        $scope.search.total = undefined;
        $scope.search.documents = undefined;
        return $http.get(config.apiUrl + '/documents/', {
          params: {
            q: query,
            limit: maxPerPage,
            skip: (page - 1) * maxPerPage,
            restrictToLatest: true,
          }
        })
        .then(
          function(response) {
            $scope.search.total = response.data.total;
            $scope.search.documents = response.data.documents;
          },
          function(response) {
            notificationService.notifications.push({
              type: 'error',
              message: 'Could not fetch documents'
            });
          }
        );
      };

      $scope.$watchGroup(['search.query', 'search.page'], (newValues) =>
        getSearchResults(newValues[0], newValues[1])
      );

      $scope.scrollToTop = function() {
        window.scrollTo(0, 0);
      };

    }
  ]);
};