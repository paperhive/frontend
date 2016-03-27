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
    },
    template: `
    <div class="container-fluid" ng-style="{
        top: ($ctrl.position === 'top' || undefined) && ($ctrl.viewportOffsetTop || 0),
        bottom: ($ctrl.position === 'bottom' || undefined) && ($ctrl.viewportOffsetBottom || 0),
      }">
      <div class="row">
        <div class="col-md-3 col-md-offset-9">
          <div class="ph-margin-link animate-show"
            ng-class="{
              'ph-margin-link-top': $ctrl.position === 'top',
              'ph-margin-link-bottom': $ctrl.position === 'bottom',
            }"
            ng-show="$ctrl.count > 0"
          >
            <a href="" class="ph-link-icon"
              scroll-to="d:{{$ctrl.nextDiscussionId}}"
              offset="{{$ctrl.viewportOffsetTop + 80}}"
            >
              <span class="ph-margin-link-current">{{$ctrl.count}}</span>
              <span class="ph-margin-link-previous">{{$ctrl.countPrevious}}</span>
              discussions
              <span ng-if="$ctrl.position === 'top'">
                above <i class="fa fa-arrow-circle-up"></i>
              </span>
              <span ng-if="$ctrl.position === 'bottom'">
                below <i class="fa fa-arrow-circle-down"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
    `,
    controller: [
      '$scope', '$element', '$window', function($scope, $element, $window) {
        const ctrl = this;

        if (ctrl.position !== 'top' && ctrl.position !== 'bottom') {
          throw new Error('position must be "top" or "bottom"');
        }

        function updateCount() {
          if (!ctrl.discussionOffsets || !ctrl.discussionSizes) return;
          let count = 0;

          ctrl.nextDiscussionId = undefined;
          const parentBoundingRect = $element[0].parentElement.getBoundingClientRect();

          // count elements count the viewport and get next discussion id
          forEach(ctrl.discussionOffsets, (offset, id) => {
            if (!ctrl.discussionSizes[id]) return;
            const height = ctrl.discussionSizes[id].height;

            if (ctrl.position === 'top') {
              if (parentBoundingRect.top + offset + height < ctrl.viewportOffsetTop) {
                count++;

                // update nextDiscussionId
                if (!ctrl.nextDiscussionId || offset >= ctrl.discussionOffsets[ctrl.nextDiscussionId]) {
                  ctrl.nextDiscussionId = id;
                }
              }
            } else {
              const viewportHeight = angular.element($window).height();
              if (parentBoundingRect.top + offset + height > ctrl.viewportOffsetTop + viewportHeight) {
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
