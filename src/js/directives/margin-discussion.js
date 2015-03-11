module.exports = function (app) {

  app.directive('marginDiscussion', function() {
    return {
      restrict: 'E',
      scope: {
        discussion: '=',
      },
      templateUrl: 'templates/directives/margin-discussion.html'
    };
  });
};
