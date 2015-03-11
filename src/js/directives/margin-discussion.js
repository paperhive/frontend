module.exports = function (app) {

  app.directive('marginDiscussion', function() {
    return {
      restrict: 'E',
      scope: {
        annotation: '=',
      },
      templateUrl: 'templates/directives/margin-discussion.html'
    };
  });
};
