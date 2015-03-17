'use strict';
module.exports = function (app) {

  app.directive('marginDiscussion', ['authService', function(authService) {
    return {
      restrict: 'E',
      scope: {
        discussion: '=',
        onReplySubmit: '&',
      },
      templateUrl: 'templates/directives/marginDiscussion.html',
      link: function (scope, element, attrs) {
        scope.state = {};
        scope.replyDraft = {};
        scope.auth = authService;
      }
    };
  }]);
};
