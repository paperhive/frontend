'use strict';

export default function(app) {
  app.controller('SearchResultsCtrl', ['config', '$http', '$location', '$scope',
    function(config, $http, $location, $scope) {

      $scope.pagination = {
        page: 1,
        maxPerPage: 10,
        total: undefined,
        maxSize: 7,
        skip: 0
      };

      // TODO get total
      $scope.pagination.total = 100;

      function countSkip(page, maxPerPage) {
        return $scope.pagination.skip = (page - 1) * maxPerPage;
      };

      $scope.query = $location.search().param;
      $scope.$on('$locationChangeSuccess', function() {
        $scope.query = $location.search().param;
        $scope.documents = undefined;
      });

      function getSearchResults(query, maxPerPage, skip) {
        return $http.get(config.apiUrl + '/documents/', {
          params: {q: query, limit: maxPerPage, skip: skip, restrictToLatest: true}
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

      $scope.$watchGroup(['query', 'pagination.maxPerPage', 'pagination.skip'], (newValues) =>
        getSearchResults(newValues[0], newValues[1], newValues[2])
      );

      $scope.$watchGroup(['pagination.page', 'pagination.maxPerPage'], (newValues) =>
        countSkip(newValues[0], newValues[1])
      );

      $scope.scrollToTop = function() {
        window.scrollTo(0, 0);
      };

    }
  ]);
};