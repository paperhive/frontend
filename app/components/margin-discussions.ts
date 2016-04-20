'use strict';
import * as angular from 'angular';
import { compact, map, mapValues, sortBy, sum } from 'lodash';

import template from './margin-discussions.html!text';

export default function(app) {
  app.component('marginDiscussions', {
    bindings: {
      discussions: '<',
      draftSelectors: '<',
      emphasizedDiscussions: '<',
      pageCoordinates: '<',
      viewportOffsetTop: '<',
      viewportOffsetBottom: '<',

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
    template,
    controller: [
      '$scope', 'distangleService', 'tourService',
      function($scope, distangleService, tourService) {
        const $ctrl = this;

        $ctrl.tour = tourService;

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

          // find topmost rect
          let topRect = selectors.pdfRectangles[0];
          selectors.pdfRectangles.forEach(rect => {
            if (topRect.page > rect.page || topRect.top > rect.top) {
              topRect = rect;
            }
          });

          // get page offset
          const pageCoord = $ctrl.pageCoordinates[topRect.pageNumber];
          if (!pageCoord) return;

          // compute position
          return pageCoord.offset.top + pageCoord.size.height * topRect.top;
        }

        // compute discussionPosititions and draftPosition
        function updatePositions() {
          if (!$ctrl.discussions) return;

          // get raw draft position
          const draftRawPosition = getRawPosition($ctrl.draftSelectors);

          // create draft coord object (falsy if it has no position or no height)
          const draftCoord = draftRawPosition !== undefined &&
            $ctrl.draftSize && $ctrl.draftSize.height &&
            {position: draftRawPosition, height: $ctrl.draftSize.height};

          // get raw discussion positions
          const discussionRawPositions = {};
          $ctrl.discussions.forEach(discussion => {
            discussionRawPositions[discussion.id] =
              getRawPosition(discussion.target.selectors);
          });

          // create array with id, offset and height for each discussion
          // (ignores discussions without size, e.g., unrendered discussions)
          const coords = sortBy(compact(map(discussionRawPositions, (position, id) => {
            if (position === undefined || !$ctrl.discussionSizes[id]) return;
            return {id, position, height: $ctrl.discussionSizes[id].height};
          })), 'position');

          // padding between elements
          const padding = 8;

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
          while (draftCoord && getTotalHeight(coordsAbove) > draftCoord.position) {
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
            place(coordsAbove, 0, draftCoord.position);
            place(coordsBelow, draftCoord.position + draftCoord.height + padding, undefined);
          } else {
            place(coordsBelow, 0, undefined);
          }

          // update controller properties
          $ctrl.draftPosition = draftCoord ? draftCoord.position : undefined;
          angular.copy(positions, $ctrl.discussionPositions);
        }

        // update positions if discussions, draftSelectors, discussionSizes,
        // draftSize or page coords changed
        [
          '$ctrl.discussions',
          '$ctrl.draftSelectors',
          '$ctrl.discussionSizes',
          '$ctrl.draftSize',
          '$ctrl.pageCoordinates',
        ].forEach(name => $scope.$watch(name, updatePositions, true));
      }
    ],
  });
}

/*

*/
