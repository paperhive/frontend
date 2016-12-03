export default function(app) {
  app.directive('onRendered', ['$parse', '$timeout', function($parse, $timeout) {
    return {
      restrict: 'A',
      link: (scope, element, attrs) => {
        $timeout(() => {
          const onRendered = $parse(attrs.onRendered);
          onRendered(scope, {});
        });
      },
    };
  }]);
};
