import * as angular from 'angular';
import { clone, compact, map, mapValues, keys, sortBy, sum } from 'lodash';

export default function(app) {
  app.component('marginDiscussions', {
    bindings: {
      discussions: '<',
      filteredDiscussions: '<',
      draftSelectors: '<',
      emphasizedDiscussions: '<',
      pageCoordinates: '<',
      viewportOffsetTop: '<',
      viewportOffsetBottom: '<',
      scrollToAnchor: '<',

      onDraftDiscard: '&',
      onDiscussionSubmit: '&',
      onDiscussionUpdate: '&',
      onDiscussionDelete: '&',
      onReplySubmit: '&',
      onReplyUpdate: '&',
      onReplyDelete: '&',
      onDiscussionMouseenter: '&',
      onDiscussionMouseleave: '&',
    },
    controller: [
      '$document', '$element', '$scope', '$timeout', '$window', 'scroll', 'channelService', 'distangleService', 'tourService',
      function($document, $element, $scope, $timeout, $window, scroll, channelService, distangleService, tourService) {
        const $ctrl = this;

        $ctrl.channelService = channelService;

        // viewport tracking for deciding which discussions actually need to be rendered
        // note: unrendered discussions will be rendered with a placeholder
        $ctrl.discussionVisibilities = {};
        function updateDiscussionVisibilities() {
          if (!$ctrl.filteredDiscussions) return;

          function getVisibleDiscussionIds(discussionIds) {
            const parentTop = $element[0].getBoundingClientRect().top;
            const viewportHeight = angular.element($window).height();
            return discussionIds.filter(discussionId => {
              const position = $ctrl.discussionPositions[discussionId];
              const size = $ctrl.discussionSizes[discussionId];
              if (position === undefined || size === undefined) return false;
              return parentTop + position + size.height > - viewportHeight && parentTop + position < 2 * viewportHeight;
            });
          }

          // determine which discussions are visible right now
          const visibleDiscussionIds = getVisibleDiscussionIds($ctrl.filteredDiscussions.map(discussion => discussion.id));

          // reevaluate after a short delay
          $timeout(() => {
            // only make discussions visible that still pass the visibility test
            const newDiscussionVisibilities = {};
            getVisibleDiscussionIds(visibleDiscussionIds)
              .forEach(discussionId => (newDiscussionVisibilities[discussionId] = true));

            if (angular.equals(newDiscussionVisibilities, $ctrl.discussionVisibilities)) return;

            angular.copy(newDiscussionVisibilities, $ctrl.discussionVisibilities);

            $scope.$evalAsync();
          }, 250, false);
        }
        // update discussion visibilities on scroll and resize event
        angular.element($window).on('scroll', updateDiscussionVisibilities);
        $element.on('$destroy', () =>
          angular.element($window).off('scroll', updateDiscussionVisibilities)
        );

        // show popover with share message?
        function resetShowShareMessageId() {
          $ctrl.showShareMessageId = undefined;
        }
        $document.on('click', resetShowShareMessageId);
        $scope.$on('$destroy', () => $document.off('click', resetShowShareMessageId));

        $ctrl.submitDiscussion = discussion => {
          const promise = $ctrl.onDiscussionSubmit({discussion});
          promise.then(newDiscussion => $ctrl.showShareMessageId = newDiscussion.id);
          return promise;
        };

        $ctrl.tour = tourService;
        // scroll to discussion tour popover
        $scope.$watch('$ctrl.discussionPositions["cDmUY04FkYx9"] !== undefined && $ctrl.tour.stages[$ctrl.tour.index] === "margin-discussion"', shouldScroll => {
          if (shouldScroll) {
            // wait until popover is rendered
            $timeout(() => {
              // trigger popover positioning
              angular.element($window).scroll();
              $timeout(() => {
                scroll.scrollTo('#discussionTourPopover', {
                  offset: ($ctrl.viewportOffsetTop || 0) + 130
                });
              });
            }, 400);
          }
        });

        // sizes of discussions by discussion id
        $ctrl.discussionSizes = {};

        // top positions of discussions by discussion id
        // (computed from pageCoordinates, selectors and marginDiscussionSizes
        // with distangleService)
        $ctrl.discussionPositions = {};
        $ctrl.draftPosition = undefined;

        // get raw top position of provided selectors (relative to offsetParent)
        function getRawPosition(selectors) {
          if (!selectors || !selectors.pdfRectangles) return;

          // get top rect of selection
          const rects = clone(selectors.pdfRectangles);
          const topRect = rects.sort((rectA, rectB) => {
            if (rectA.pageNumber < rectB.pageNumber) return -1;
            if (rectA.pageNumber > rectB.pageNumber) return 1;
            if (rectA.top < rectB.top) return -1;
            if (rectA.top > rectB.top) return 1;
            return 0;
          })[0];

          // get page offset
          const pageCoord = $ctrl.pageCoordinates[topRect.pageNumber];
          if (!pageCoord) return;

          // compute position
          return pageCoord.offset.top + pageCoord.size.height * topRect.top;
        }

        function updateScroll() {
          // do not scroll if already scrolled to this anchor
          if ($ctrl.scrollToAnchor === $ctrl.currentScrollAnchor) return;

          // reset scrolledAnchor (possibly updated below)
          $ctrl.currentScrollAnchor = undefined;

          // test if the anchor is a discussion anchor
          const match = /^d:(.*)$/.exec($ctrl.scrollToAnchor);
          if (!match) return;
          const id = match[1];

          // get element
          const element = document.getElementById(`discussion-${id}`);
          if (!element || !element.offsetParent) return;

          const top = angular.element(element.offsetParent).offset().top +
            $ctrl.discussionPositions[id];

          scroll.scrollTo(top, {
            duration: 1000,
            offset: ($ctrl.viewportOffsetTop || 0) + 130,
          });

          $ctrl.currentScrollAnchor = $ctrl.scrollToAnchor;
        }

        $scope.$watch('$ctrl.scrollToAnchor', updateScroll);
        $scope.$watchCollection('$ctrl.discussionPositions', updateScroll);

        // compute discussionPosititions and draftPosition
        function updatePositions() {
          if (!$ctrl.filteredDiscussions) return;

          // get raw draft position
          const draftRawPosition = getRawPosition($ctrl.draftSelectors);

          // create draft coord object (falsy if it has no position or no height)
          const draftCoord = draftRawPosition !== undefined &&
            $ctrl.draftSize && $ctrl.draftSize.height &&
            {position: draftRawPosition, height: $ctrl.draftSize.height};

          // get raw discussion positions
          const discussionRawPositions = {};
          $ctrl.filteredDiscussions.forEach(discussion => {
            discussionRawPositions[discussion.id] =
              getRawPosition(discussion.target.selectors);
            if (!$ctrl.discussionSizes[discussion.id]) {
              $ctrl.discussionSizes[discussion.id] = {height: 135};
            }
          });

          // create array with id, offset and height for each discussion
          // (ignores discussions without size, e.g., unrendered discussions)
          const coords = sortBy(compact(map(discussionRawPositions, (position, id) => {
            if (position === undefined || !$ctrl.discussionSizes[id]) return;
            return {id, position, height: $ctrl.discussionSizes[id].height};
          })), 'position');

          // padding between elements
          const padding = 8;
          const offsetTop = 70;

          // treat above and below separately
          const coordsAbove = draftCoord &&
            coords.filter(coord => coord.position <= draftCoord.position);
          const coordsBelow = coords.filter(coord =>
            !draftCoord || coord.position > draftCoord.position
          );

          // move bottom elements from above to below if there's not enough space
          function getTotalHeight(coords) {
            return sum(map(coords, 'height')) + coords.length * padding;
          }
          while (draftCoord && getTotalHeight(coordsAbove) + offsetTop > draftCoord.position) {
            // remove last one in above
            const last = coordsAbove.splice(-1, 1);
            // insert to beginning of below
            coordsBelow.unshift(last[0]);
          }

          const positions = {};
          function place(_coords, lb, ub) {
            const ids = map(_coords, 'id');
            const anchors = map(_coords, 'position');
            const heights = map(_coords, coord => coord.height + padding);

            const optAnchors = distangleService.distangle(anchors, heights, lb, ub);
            for (let i = 0; i < anchors.length; i++) {
              positions[ids[i]] = optAnchors[i];
            }
          };

          // place discussions
          if (draftCoord) {
            place(coordsAbove, offsetTop, draftCoord.position);
            place(coordsBelow, draftCoord.position + draftCoord.height + padding, undefined);
          } else {
            place(coordsBelow, offsetTop, undefined);
          }

          // update controller properties
          $ctrl.draftPosition = draftCoord ? draftCoord.position : undefined;
          angular.copy(positions, $ctrl.discussionPositions);
          updateDiscussionVisibilities();

          // sort by position (for preventing z-index issues)
          $ctrl.sortedDiscussions = $ctrl.filteredDiscussions
            .filter(discussion => positions[discussion.id] !== undefined)
            .sort((discussionA, discussionB) => {
              const pA = positions[discussionA.id];
              const pB = positions[discussionB.id];
              if (pA < pB) return -1;
              if (pA > pB) return 1;
              return 0;
            });
        }

        // update positions if discussions, draftSelectors, discussionSizes,
        // draftSize or page coords changed
        $scope.$watchCollection('$ctrl.filteredDiscussions', updatePositions);
        $scope.$watch('$ctrl.draftSelectors', updatePositions);
        $scope.$watch('$ctrl.draftSize', updatePositions);
        $scope.$watchCollection('$ctrl.discussionSizes', updatePositions);
        $scope.$watchCollection('$ctrl.pageCoordinates', updatePositions);
      }
    ],
    template: require('./margin-discussions.html'),
  });
}
