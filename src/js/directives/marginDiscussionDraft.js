module.exports = function (app) {
  'use strict';

  app.directive('marginDiscussionDraft', [
    'authService',
    function(authService) {
      return {
        restrict: 'E',
        scope: {
          onSubmit: '&',
          comment: '='
        },
        templateUrl: 'templates/directives/marginDiscussionDraft.html',
        link: function(scope, element) {
          scope.auth = authService;
        }
      };
    }]);
};
