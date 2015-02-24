module.exports = function (app) {

  app.directive('inlineAnnotation', function() {
    return {
      restrict: 'E',
      controller: 'AnnotationCtrl',
      scope: {
        title: '=',
        body: '=',
        author: '='
      },
      templateUrl: 'templates/article/text/inline-annotation.html'
    };
  });
};
