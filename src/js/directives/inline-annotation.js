module.exports = function (app) {

  app.directive('inlineAnnotation', function() {
    return {
      restrict: 'E',
      controller: 'AnnotationCtrl',
      scope: {
        title: '=',
        body: '=',
        author: '=',
        verticalOffset: '='
      },
      templateUrl: 'templates/article/text/inline-annotation.html'
    };
  });
};
