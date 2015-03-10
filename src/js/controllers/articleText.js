var _ = require('lodash');

module.exports = function (app) {
  app.controller('ArticleTextCtrl', [
    '$scope', '$route', '$routeSegment', '$document', '$http', 'config',
    'authService', 'notificationService',
    function($scope, $route, $routeSegment, $document, $http, config,
             authService, notificationService) {
      
      $scope.text = {
        highlightInfos: {},
        highlightBorder: {}
      };
    }
  ]);
};
