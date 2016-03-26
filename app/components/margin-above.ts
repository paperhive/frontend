import angular from 'angular';
import { forEach } from 'lodash';

export default function(app) {
  app.component('marginAbove', {
    bindings: {
      discussionOffsets: '<',
      discussionSizes: '<',
      viewportOffsetTop: '<',
    },
    template: `
    <div class="container-fluid" ng-style="{top: $ctrl.viewportOffsetTop}">
      <div class="row">
        <div class="col-md-3 col-md-offset-9">
          <div class="ph-margin-link animate-show" ng-show="$ctrl.above > 0">
            <a href="" class="ph-link-icon"
              scroll-to="d:{{$ctrl.nextDiscussionId}}"
              offset="{{$ctrl.viewportOffsetTop + 80}}"
            >
              {{$ctrl.above}} discussions above <i class="fa fa-arrow-circle-up"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    `,
    controller: [
      '$scope', '$element', '$window', function($scope, $element, $window) {
        const ctrl = this;

        function updateAbove() {
          if (!ctrl.discussionOffsets || !ctrl.discussionSizes) return;

          ctrl.above = 0;
          ctrl.nextDiscussionId = undefined;
          const parentBoundingRect = $element[0].parentElement.getBoundingClientRect();

          // count elements above the viewport and get next discussion id
          forEach(ctrl.discussionOffsets, (offset, id) => {
            if (!ctrl.discussionSizes[id]) return;
            const height = ctrl.discussionSizes[id].height;

            if (parentBoundingRect.top + offset + height < ctrl.viewportOffsetTop) {
              ctrl.above++;

              // update nextDiscussionId
              if (!ctrl.nextDiscussionId || offset >= ctrl.discussionOffsets[ctrl.nextDiscussionId]) {
                ctrl.nextDiscussionId = id;
              }
            }
          });
        }

        // register updateAbove on change of input data
        $scope.$watchGroup(
          [
            '$ctrl.discussionOffsets',
            '$ctrl.discussionSizes',
            '$ctrl.viewportOffsetTop'
          ],
          updateAbove, true
        );

        // register/unregister updateAbove on scroll and resize events
        angular.element($window).on('scroll', updateAbove);
        angular.element($window).on('resize', updateAbove);
        $element.on('$destroy', () => angular.element($window).off('scroll', updateAbove));
        $element.on('$destroy', () => angular.element($window).off('resize', updateAbove));
      }
    ],
  });
}
