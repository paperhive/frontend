'use strict';

export default function(app) {
  app.directive('onRendered', ['$parse', '$timeout', function($parse, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $timeout(() => {
          const onRendered = $parse(attrs.onRendered);
          onRendered(scope, {});
        });
      }
    };
  }]);
};
