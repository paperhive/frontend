import angular from 'angular';
import { clone, compact, map, sortBy, sum } from 'lodash';

require('./margin.less');

export default function(app) {
  app.component('margin', {
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
      onDiscussionHover: '&',
    },
    controller: [
      '$document', '$element', '$scope', '$timeout', '$window', 'scroll',
      'channelService', 'distangleService', 'tourService',
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
          const visibleDiscussionIds = getVisibleDiscussionIds(
            $ctrl.filteredDiscussions.map(discussion => discussion.id),
          );

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
          angular.element($window).off('scroll', updateDiscussionVisibilities),
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
        $scope.$watch(
          '$ctrl.discussionPositions["cDmUY04FkYx9"] !== undefined ' +
          '&& $ctrl.tour.stages[$ctrl.tour.index] === "margin-discussion"',
          shouldScroll => {
            if (shouldScroll) {
              // wait until popover is rendered
              $timeout(() => {
                // trigger popover positioning
                angular.element($window).scroll();
                $timeout(() => {
                  scroll.scrollTo('#discussionTourPopover', {
                    offset: ($ctrl.viewportOffsetTop || 0) + 130,
                  });
                });
              }, 400);
            }
          },
        );

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

        // compute positionedDiscussions and discussionClusters
        function updateClusters() {
          $ctrl.discussionClusters = undefined;
          $ctrl.positionedDiscussions = undefined;

          if (!$ctrl.filteredDiscussions) return;

          // get position and sort by position
          const positionedDiscussions = $ctrl.filteredDiscussions
            .map(discussion => ({
              discussion,
              top: getRawPosition(discussion.target.selectors),
            }))
            .filter(positionedDiscussion => positionedDiscussion.top !== undefined)
            .sort((a, b) => a.top < b.top ? -1 : 1);

          // group into clusters
          const clusters = [];
          const clusterHeight = 135;
          positionedDiscussions.forEach(positionedDiscussion => {
            const lastCluster = clusters.length > 0 && clusters[clusters.length - 1];
            if (!lastCluster || lastCluster.top + clusterHeight < positionedDiscussion.top) {
              clusters.push({
                top: positionedDiscussion.top,
                discussions: [positionedDiscussion.discussion],
              });
              return;
            }

            lastCluster.discussions.push(positionedDiscussion.discussion);
          });

          // generate cluster ids
          clusters.forEach(cluster => {
            cluster.id = cluster.discussions
              .map(discussion => discussion.id)
              .join(':');
          });

          $ctrl.positionedDiscussions = positionedDiscussions;
          $ctrl.discussionClusters = clusters;
        }

        $ctrl.discussionDelete = function (discussion) {
          return $ctrl.onDiscussionDelete({discussion})
            .then(() => {
              const idx = $ctrl.currentCluster.discussions.indexOf(discussion);
              if (idx === -1) return;
              $ctrl.currentCluster.discussions.splice(idx, 1);
              if ($ctrl.currentCluster.discussions.length === 0) {
                $ctrl.currentCluster = undefined;
              }
            });
        };

        $ctrl.highlightCluster = function(cluster, hovered) {
          cluster.discussions.forEach(discussion => $ctrl.onDiscussionHover({discussion, hovered}));
        };

        // update positions if discussions, or page coords changed
        $scope.$watchCollection('$ctrl.filteredDiscussions', updateClusters);
        $scope.$watchCollection('$ctrl.pageCoordinates', updateClusters);
      },
    ],
    template: require('./margin.html'),
  });
}
