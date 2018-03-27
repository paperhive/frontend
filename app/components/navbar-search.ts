import { isDocumentItemSharedWithUser } from '../utils/document-items';

const navbarSearchItemUrl = require('!ngtemplate-loader?relativeTo=/app!html-loader!./navbar-search-item.html');

export default function(app) {
  app.component('navbarSearch', {
    controller: ['$scope', '$http', '$location', '$routeSegment',
      'authService', 'config', 'notificationService',
      function(
        $scope, $http, $location, $routeSegment,
        authService, config, notificationService,
      ) {
        $scope.navbarSearchItemUrl = navbarSearchItemUrl;

        $scope.showAllResults = function(input) {
          $location.path('/search/').search({query: input, page: 1});
        };

        $scope.search = {};
        $scope.phSearch = function(query, limit) {
          return $http.get(config.apiUrl + '/document-items/search/by-prefix', {
            params: {prefix: query, limit},
          })
          .then(
            function(response) {
              return response.data.hits;
            },
            function(response) {
              notificationService.notifications.push({
                type: 'error',
                message: 'Could not fetch documents',
              });
            },
          );
        };

        $scope.isOwnedByYou = documentItem => authService.user && documentItem.owner === authService.user.id;
        $scope.isSharedWithYou = documentItem => isDocumentItemSharedWithUser(documentItem, authService.user);

        $scope.goToDocument = function(hit, model, label) {
          console.log(hit)
          $location
            .path($routeSegment.getSegmentUrl(
              'documentItem', {documentItem: hit.documentItem.id},
            ))
            .search({});

          $scope.search.body = '';
        };
      },
    ],
    template: require('./navbar-search.html'),
  });
};
