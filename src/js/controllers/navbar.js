'use strict';
module.exports = function(app) {
  app.controller(
    'NavbarCtrl',
    ['$scope', '$http', '$location', '$window', '$routeSegment', 'config',
      function($scope, $http, $location, $window, $routeSegment, config) {
        $scope.collapsed = true;

        $scope.search = {};
        $scope.phSearch = function(query, limit) {
          return $http.get(config.apiUrl + '/articles/', {
            params: {q: query, limit: limit}
          })
          .then(function(response) {
            return response.data;
          });
        };

        $scope.goToArticle = function(item, model, label) {
          $location.path($routeSegment.getSegmentUrl(
            'articles', {articleId: item._id}
          ));
          $window.location.reload();
        };
      }
    ]
  );
};
