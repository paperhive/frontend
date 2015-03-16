'use strict';
module.exports = function (app) {

  app.directive('marginDiscussion', ['authService', function(authService) {
    return {
      restrict: 'E',
      scope: {
        discussion: '=',
      },
      templateUrl: 'templates/directives/marginDiscussion.html',
      link: function (scope, element, attrs) {
        scope.state = {};
        scope.auth = authService;
      }
    };
  }]);
};
