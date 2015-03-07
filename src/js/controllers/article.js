var _ = require('lodash');

module.exports = function (app) {
  app.controller('ArticleCtrl', [
    '$scope', '$route', '$routeSegment', '$document', '$http', 'config',
    'authService', 'notificationService',
    function($scope, $route, $routeSegment, $document, $http, config,
             authService, notificationService) {

      // expose authService
      $scope.auth = authService;
      // Expose the routeSegment to be able to determine the active tab in the
      // template.
      $scope.$routeSegment = $routeSegment;

      // fetch article
      $http.get(config.api_url + '/articles/' + $routeSegment.$routeParams.id)
        .success(function (article) {
          $scope.article = article;
        })
        .error(function (data) {
          notificationService.notifications.push({
            type: 'error',
            message: data.message ? data.message : 'could not fetch article ' +
              '(unknown reason)'
          });
        });

      $scope.annotations = {
        draft: {_id: _.uniqueId()},
        stored: [],
        highlightInfos: {}
      };

      $scope.onPdfLoaded = function () {
        // DEBUG START contains everything related to a annotations
        /*
        $scope.annotations.stored = [{
          _id: _.uniqueId(),
          selection: '0/10/1/0/0/0:35,0/10/1/0/0/0:41',
          author: authService.user,
          title: 'Matrix properties',
          body: 'Is it SPD?',
        }];
        */
        // DEBUG END
      };

      $scope.purgeDraft = function() {
        $scope.annotations.draft = {_id: _.uniqueId()};
      };
    }]);
};
