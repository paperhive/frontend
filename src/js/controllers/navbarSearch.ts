'use strict';
module.exports = function(app) {
  app.controller(
    'NavbarSearchCtrl',
    ['$scope', '$http', '$location', '$routeSegment', 'config',
      'notificationService',
      function(
        $scope, $http, $location, $routeSegment, config,
        notificationService
      ) {
        $scope.search = {};
        $scope.phSearch = function(query, limit) {
          return $http.get(config.apiUrl + '/documents/', {
            params: {q: query, limit: limit, restrictToLatest: true}
          })
          .then(
            function(response) {
              return response.data.documents;
            },
            function(response) {
              notificationService.notifications.push({
                type: 'error',
                message: 'Could not fetch articles'
              });
            }
          );
        };

        $scope.goToArticle = function(item, model, label) {
          $location.path($routeSegment.getSegmentUrl(
            'articles', {articleId: item.id}
          ));
        };
      }
    ]
  );
};
