const navbarSearchItemUrl = require('!ngtemplate-loader?relativeTo=/app!html-loader!./navbar-search-item.html');

export default function(app) {
  app.component('navbarSearch', {
    controller: ['$scope', '$http', '$location', '$routeSegment', 'config',
      'notificationService', 'tourService',
      function(
        $scope, $http, $location, $routeSegment, config,
        notificationService, tourService,
      ) {
        $scope.navbarSearchItemUrl = navbarSearchItemUrl;
        $scope.tour = tourService;

        $scope.showAllResults = function(input) {
          $location.path('/search/').search({query: input, page: 1});
        };

        $scope.search = {};
        $scope.phSearch = function(query, limit) {
          return $http.get(config.apiUrl + '/documents/prefix_search', {
            params: {q: query, limit},
          })
          .then(
            function(response) {
              return response.data.documents;
            },
            function(response) {
              notificationService.notifications.push({
                type: 'error',
                message: 'Could not fetch documents',
              });
            },
          );
        };

        $scope.goToDocument = function(item, model, label) {
          $location
            .path($routeSegment.getSegmentUrl(
              'documents', {documentId: item.id},
            ))
            .search({});

          $scope.search.body = '';
        };
      },
    ],
    template: require('./navbar-search.html'),
  });
};
