import * as angular from 'angular';

export default function(app) {

  /* Usage: <div on-resized="$ctrl.mySize = $size">
   *
   * The size is automatically updated on resize events via the
   * javascript-detect-element-resize jquery plugin.
   *
   * The size has the properties `height` and `width`.
   */
  app.directive('onResized', [
    '$parse', '$window', '$timeout', function($parse, $window, $timeout) {
      return {
        restrict: 'A',
        link: (scope, element, attrs) => {
          let oldSize = {};

          const resizeHandler = function() {
            const newSize = {
              height: element[0].offsetHeight,
              width: element[0].offsetWidth,
              scrollHeight: element[0].scrollHeight,
              scrollWidth: element[0].scrollWidth,
            };

            // return if unchanged
            if (angular.equals(newSize, oldSize)) return;

            oldSize = newSize;

            scope.$evalAsync(attrs.onResized, {$size: newSize});
          };

          // attach event handler
          // (relies on detect-element-resize jquery module)
          element.resize(resizeHandler);

          // detach event handler upon destruction of element
          // $destroy seems to be emitted multiple times, so we only
          // clean up once
          let destroyed = false;
          element.on('$destroy', function() {
            if (!destroyed) {
              element.removeResize(resizeHandler);
            }
            destroyed = true;
          });

          // call handler once
          $timeout(resizeHandler);
        },
      };
    },
  ]);
};
