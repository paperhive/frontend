module.exports = function (app) {

  app.directive('inlineAnnotation', function() {
    return {
      restrict: 'E',
      scope: {
        annotation: '=',
      },
      templateUrl: 'templates/articles/text/inline-annotation.html'
    };
  });
};
