import angular from 'angular';
import { defaults } from 'lodash';

export default function(app) {

  /* Usage: <div on-visibility-changed="$ctrl.visibility = $visibility"
   *             visibility-offset="{top: 50, bottom: 10}">
   *
   * Updated on scroll and resize events (resize events are
   * detected via the javascript-detect-element-resize jquery plugin).
   *
   * $visibility has the properties `bottom`, `left`, `right, `top` and can
   * take the values 'visibile', 'partial', 'hidden'.
   */
  app.directive('onVisibilityChanged', [
    '$parse', '$window', '$timeout', function($parse, $window, $timeout) {
      return {
        restrict: 'A',
        link: (scope, element, attrs) => {
          let oldVisibility;
          let offset;

          const updateVisibility = function() {
            const rect = element[0].getBoundingClientRect();

            const newVisibility = {top: 'visible', bottom: 'visible', left: 'visible', right: 'visible'};

            if (rect.bottom < offset.top) {
              newVisibility.top = 'hidden';
            } else if (rect.top < offset.top) {
              newVisibility.top = 'partial';
            }

            if (rect.top > $window.innerHeight - offset.bottom) {
              newVisibility.bottom = 'hidden';
            } else if (rect.bottom > $window.innerHeight - offset.bottom) {
              newVisibility.bottom = 'partial';
            }

            if (rect.right < offset.left) {
              newVisibility.left = 'hidden';
            } else if (rect.left < offset.left) {
              newVisibility.left = 'partial';
            }

            if (rect.left > $window.innerWidth - offset.right) {
              newVisibility.bottom = 'hidden';
            } else if (rect.right > $window.innerWidth - offset.right) {
              newVisibility.bottom = 'partial';
            }

            // return if unchanged
            if (angular.equals(oldVisibility, newVisibility)) return;
            oldVisibility = newVisibility;

            scope.$evalAsync(attrs.onVisibilityChanged, {$visibility: newVisibility});
          };

          // attach event handler
          element.resize(updateVisibility);
          angular.element($window).on('scroll', updateVisibility);

          // detach event handler upon destruction of element
          // $destroy seems to be emitted multiple times, so we only
          // clean up once
          let destroyed = false;
          element.on('$destroy', function() {
            if (!destroyed) {
              element.removeResize(updateVisibility);
              angular.element($window).off('scroll', updateVisibility);
            }
            destroyed = true;
          });

          // watch offset (calls handler once at least)
          scope.$watchCollection(attrs.visibilityOffset, newOffset => {
            offset = defaults({}, newOffset, {top: 0, bottom: 0, left: 0, right: 0});
            $timeout(updateVisibility);
          });
        },
      };
    },
  ]);
};
