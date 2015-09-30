'use strict';

var angular = require('angular');

module.exports = function(app) {

  app.directive('elementPosition', [
    '$parse', '$window', '$timeout', function($parse, $window, $timeout) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var position = {};
          var setter = $parse(attrs.elementPosition);
          if (setter && setter.assign) {
            setter.assign(scope, position);
          } else {
            console.warn('Cannot assign position');
          }

          var positionHandler = function(e) {
            var rect = element[0].getBoundingClientRect();
            // angular.copy and _.clone do *not* work here -> copy manually
            var properties =
              ['bottom', 'height', 'left', 'right', 'top', 'width'];
            var newPosition = {};
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
          var destroyed = false;
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
