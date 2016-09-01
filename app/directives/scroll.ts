export default function(app) {
  app.directive('scroll', ['$parse', 'scroll', function ($parse, scroll) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.on('click', event => {
          scroll.scrollTo($parse(attrs.scrollTo)(scope), {
            duration: $parse(attrs.scrollDuration)(scope),
            offset: $parse(attrs.scrollOffset)(scope),
            before: () => scope.$apply(attrs.scrollBefore),
            after: () => scope.$apply(attrs.scrollAfter),
          });
        });
      },
    };
  }]);
};
