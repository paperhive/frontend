import angular from 'angular';
import { forEach } from 'lodash';

export default function(app) {
  app.component('marginAbove', {
    bindings: {
      discussionOffsets: '<',
      viewportOffsetTop: '<',
      onAboveChanged: '&',
    },
    template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-3 col-md-offset-9">
          <div class="ph-margin-link" ng-if="$ctrl.above > 0">
            <a href="" class="ph-link-icon">
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
        ctrl.above = 0;

        function updateAbove() {
          let above = 0;
          const parentBoundingRect = $element[0].parentElement.getBoundingClientRect();

          // count elements above the viewport
          forEach(ctrl.discussionOffsets, (offset) => {
            console.log(parentBoundingRect.top, offset, ctrl.viewportOffsetTop);
            if (parentBoundingRect.top + offset < ctrl.viewportOffsetTop) {
              above++;
            }
          });

          // notify on change
          if (ctrl.above !== above) {
            ctrl.onAboveChanged({above: above});
            ctrl.above = above;
          }
        }

        // register updateAbove on change of input data
        $scope.$watch('$ctrl.discussionOffsets', updateAbove, true);
        $scope.$watch('$ctrl.viewportOffsetTop', updateAbove);

        // register/unregister updateAbove on scroll and resize events
        angular.element($window).on('scroll', updateAbove);
        angular.element($window).on('resize', updateAbove);
        $element.on('$destroy', () => angular.element($window).off('scroll', updateAbove));
        $element.on('$destroy', () => angular.element($window).off('resize', updateAbove));
      }
    ],
  });
}
