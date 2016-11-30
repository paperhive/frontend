import angular from 'angular';
import { forEach } from 'lodash';

export default function(app) {
  app.component('marginLink', {
    bindings: {
      position: '@',
      discussionOffsets: '<',
      discussionSizes: '<',
      viewportOffsetTop: '<',
      viewportOffsetBottom: '<',
      extraOffset: '<',
    },
    controller: [
      '$scope', '$element', '$window', function($scope, $element, $window) {
        const ctrl = this;

        if (ctrl.position !== 'top' && ctrl.position !== 'bottom') {
          throw new Error('position must be "top" or "bottom"');
        }

        function updateCount() {
          if (!ctrl.discussionOffsets || !ctrl.discussionSizes) return;
          let count = 0;

          // add/substract extra offset such that an element is considered to be
          // hidden if this number of pixels is visible at maximum
          const extraOffset = ctrl.extraOffset || 70;

          ctrl.nextDiscussionId = undefined;

          // get position of parent element
          // (may be null when the element is detached/destroyed)
          let parent = $element[0].parentElement;
          if (!parent) return;
          parent = parent.parentElement;
          if (!parent) return;
          const parentBoundingRect = parent.getBoundingClientRect();

          ctrl.parentTop = parentBoundingRect.top;

          // count elements above/below the viewport and get next discussion id
          forEach(ctrl.discussionOffsets, (offset, id) => {
            if (!ctrl.discussionSizes[id]) return;
            const height = ctrl.discussionSizes[id].height;

            if (ctrl.position === 'top') {
              if (parentBoundingRect.top + offset + height - extraOffset < ctrl.viewportOffsetTop) {
                count++;

                // update nextDiscussionId
                if (!ctrl.nextDiscussionId || offset >= ctrl.discussionOffsets[ctrl.nextDiscussionId]) {
                  ctrl.nextDiscussionId = id;
                }
              }
            } else {
              const viewportHeight = angular.element($window).height();
              if (parentBoundingRect.top + offset + extraOffset > viewportHeight) {
                count++;

                // update nextDiscussionId
                if (!ctrl.nextDiscussionId || offset <= ctrl.discussionOffsets[ctrl.nextDiscussionId]) {
                  ctrl.nextDiscussionId = id;
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
        $scope.$watchCollection('$ctrl.discussionOffsets', updateCount);
        $scope.$watchCollection('$ctrl.discussionSizes', updateCount);
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
      }
    ],
    template: require('./margin-link.html'),
  });
}
