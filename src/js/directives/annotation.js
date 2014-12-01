module.exports = function (app) {

  app.directive('annotation', function() {
    return {
      restrict: 'E',
      scope: {
        annotation: '=content'
      },
      templateUrl: 'templates/comment.html',
      //link: function (scope, element) {
      //  scope.name = 'Jeff';
      //}
    };
  });
};
