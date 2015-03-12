module.exports = function (app) {
  'use strict';

  app.directive('marginDiscussion', function() {
    return {
      restrict: 'E',
      scope: {
        discussion: '=',
      },
      templateUrl: 'templates/directives/marginDiscussion.html'
    };
  });
};
