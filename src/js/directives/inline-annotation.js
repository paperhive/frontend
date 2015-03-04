module.exports = function (app) {

  app.directive('inlineAnnotation', function() {
    return {
      restrict: 'E',
      controller: 'AnnotationCtrl',
      scope: {
        annotation: '=',
      },
      templateUrl: 'templates/article/text/inline-annotation.html'
    };
  });
};
