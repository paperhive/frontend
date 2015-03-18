'use strict';
module.exports = function(app) {
  app.controller(
    'NavbarCtrl',
    ['$scope', '$http', 'config',
      function($scope, $http, config) {
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
      }
    ]
  );
};
