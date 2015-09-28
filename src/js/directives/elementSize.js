'use strict';

var angular = require('angular');

module.exports = function(app) {

  app.directive('elementSize', [
    '$parse', '$window', '$timeout', function($parse, $window, $timeout) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var size = {};
          var setter = $parse(attrs.elementSize);
          if (setter && setter.assign) {
            setter.assign(scope, size);
          } else {
            console.warn('Cannot assign size');
          }

          var resizeHandler = function(e) {
            var newSize = {
              height: element[0].offsetHeight,
              width: element[0].offsetWidth
            };

            // return if unchanged
            if (angular.equals(size, newSize)) {
              return;
            }

            // copy object
            angular.copy(newSize, size);

            // call apply if this function has been called as an event handler
            if (e) {
              scope.$apply();
            }
          };

          // attach event handler
          // (relies on detect-element-resize jquery module)
          element.resize(resizeHandler);

          // detach event handler upon destruction of element
          // $destroy seems to be emitted multiple times, so we only
          // clean up once
          var destroyed = false;
          element.on('$destroy', function() {
            if (!destroyed) {
              element.removeResize(resizeHandler);
            }
            destroyed = true;
          });

          // call handler once
          $timeout(resizeHandler());
        }
      };
    }
  ]);
};
