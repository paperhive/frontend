import angular from 'angular';
import { forEach } from 'lodash';

export default function(app) {
  app.component('marginLink', {
    bindings: {
      position: '@',
      clusters: '<',
      viewportOffsetTop: '<',
      viewportOffsetBottom: '<',
      extraOffset: '<',
      onScrollToCluster: '&',
    },
    controller: [
      '$scope', '$element', '$window', function($scope, $element, $window) {
        const ctrl = this;

        if (ctrl.position !== 'top' && ctrl.position !== 'bottom') {
          throw new Error('position must be "top" or "bottom"');
        }

        function updateCount() {
          ctrl.nextCluster = undefined;

          if (!ctrl.clusters) return;
          let count = 0;

          // max height of a cluster
          const maxHeight = 140;

          // add/substract extra offset such that an element is considered to be
          // hidden if more than this amount of pixels are hidden
          const extraOffset = ctrl.extraOffset || 20;

          // get position of parent element
          // (may be null when the element is detached/destroyed)
          let parent = $element[0].parentElement;
          if (!parent) return;
          parent = parent.parentElement;
          if (!parent) return;
          const parentBoundingRect = parent.getBoundingClientRect();

          ctrl.parentTop = parentBoundingRect.top;

          // count elements above/below the viewport and get next cluster
          forEach(ctrl.clusters, (cluster: any) => {
            const top = cluster.top;

            if (ctrl.position === 'top') {
              if (parentBoundingRect.top + top + extraOffset < ctrl.viewportOffsetTop) {
                count += cluster.discussions.length;

                // update nextCluster
                if (!ctrl.nextCluster || top >= ctrl.nextCluster.top) {
                  ctrl.nextCluster = cluster;
                }
              }
            } else {
              const viewportHeight = angular.element($window).height();
              if (parentBoundingRect.top + top - extraOffset + maxHeight > viewportHeight) {
                count += cluster.discussions.length;

                // update nextCluster
                if (!ctrl.nextCluster || top <= ctrl.nextCluster.top) {
                  ctrl.nextCluster = cluster;
                }
              }
            }
          });

          // update count and countPrevious
          if (ctrl.count !== count) {
            ctrl.countPrevious = ctrl.count;
            ctrl.count = count;
          }
        }

        // register updateCount on change of input data
        $scope.$watchCollection('$ctrl.clusters', updateCount);
        $scope.$watch('$ctrl.viewportOffsetTop', updateCount);

        // wrap updateCount with $apply for non-angular events
        const updateCountApply = () => $scope.$evalAsync(updateCount);

        // register/unregister updateCount on scroll and resize events
        angular.element($window).on('scroll', updateCountApply);
        angular.element($window).on('resize', updateCountApply);
        $element.on('$destroy', () => {
          angular.element($window).off('scroll', updateCountApply);
          angular.element($window).off('resize', updateCountApply);
        });
      },
    ],
    template: require('./margin-link.html'),
  });
}
