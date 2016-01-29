'use strict';

const angular = require('angular');

export default function(app) {

  /* Usage: <div element-position="myPosition">
   *
   * Exposes the position of the element in the scope variable `myPosition`.
   * The position is calculated relative to the current viewport and is
   * automatically updated on scroll and resize events (resize events are
   * detected via the javascript-detect-element-resize jquery plugin).
   *
   * The position has the properties `bottom`, `left`, `right, `top`.
   * Additionally, the size of the element is provided by `height` and `width`.
   */
  app.directive('elementPosition', [
    '$parse', '$window', '$timeout', function($parse, $window, $timeout) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          const position = {};
          const setter = $parse(attrs.elementPosition);
          if (setter && setter.assign) {
            setter.assign(scope, position);
          } else {
            console.warn('Cannot assign position');
          }

          const positionHandler = function(e) {
            const rect = element[0].getBoundingClientRect();
            // angular.copy and _.clone do *not* work here -> copy manually
            const properties =
              ['bottom', 'height', 'left', 'right', 'top', 'width'];
            const newPosition = {};
            angular.forEach(properties, function(property) {
              newPosition[property] = rect[property];
            });

            // return if unchanged
            if (angular.equals(position, newPosition)) {
              return;
            }

            // copy object
            angular.copy(newPosition, position);

            // call apply if this function has been called as an event handler
            if (e) {
              scope.$apply();
            }
          };

          // attach event handler
          element.resize(positionHandler);
          angular.element($window).on('scroll', positionHandler);

          // detach event handler upon destruction of element
          // $destroy seems to be emitted multiple times, so we only
          // clean up once
          let destroyed = false;
          element.on('$destroy', function() {
            if (!destroyed) {
              element.removeResize(positionHandler);
              angular.element($window).off('scroll', positionHandler);
            }
            destroyed = true;
          });

          // call handler once
          $timeout(positionHandler);
        }
      };
    }
  ]);
};
