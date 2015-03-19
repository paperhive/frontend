'use strict';
module.exports = function(app) {
  app.controller(
    'NavbarCtrl',
    ['$scope', '$http', '$location', '$window', '$routeSegment', 'config',
      'notificationService',
      function(
        $scope, $http, $location, $window, $routeSegment, config,
        notificationService
      ) {
        $scope.collapsed = true;

        $scope.search = {};
        $scope.phSearch = function(query, limit) {
          return $http.get(config.apiUrl + '/articles/', {
            params: {q: query, limit: limit}
          })
          .then(
            function(response) {return response.data;},
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
            'articles', {articleId: item._id}
          ));
        };
      }
    ]
  );
};
