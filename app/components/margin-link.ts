import angular from 'angular';
import { forEach } from 'lodash';

import marginLinkTemplate from './margin-link.html!text';

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
    template: marginLinkTemplate,
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
          const parentBoundingRect = $element[0].parentElement.getBoundingClientRect();

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
        $scope.$watchGroup(
          [
            '$ctrl.discussionOffsets',
            '$ctrl.discussionSizes',
            '$ctrl.viewportOffsetTop'
          ],
          updateCount, true
        );

        // register/unregister updateCount on scroll and resize events
        angular.element($window).on('scroll', updateCount);
        angular.element($window).on('resize', updateCount);
        $element.on('$destroy', () => angular.element($window).off('scroll', updateCount));
        $element.on('$destroy', () => angular.element($window).off('resize', updateCount));
      }
    ],
  });
}
