'use strict';
var _ = require('lodash');

module.exports = function (app) {

  app.controller('ArticleTextCtrl', [
    '$scope', '$route', '$routeSegment', '$document', '$http', 'config',
    'authService', 'notificationService',
    function($scope, $route, $routeSegment, $document, $http, config,
             authService, notificationService) {

      $scope.text = {
        highlightInfos: {},
        highlightBorder: {},
        marginDiscussionSizes: {},
        marginOffsets: {}
      };

      // compute offsets of margin discussions ('boingidi')
      var updateOffsets = function () {
        var draftTop = $scope.originalComment.draft.target &&
          $scope.text.highlightInfos.draft &&
          $scope.text.highlightInfos.draft.top || 0;
        var draftHeight = draftTop &&
          $scope.text.marginDiscussionSizes.draft &&
          $scope.text.marginDiscussionSizes.draft.height;

        var offsets = _.sortBy(_.compact(_.map(
          $scope.text.highlightInfos,
          function (val, key) {
            var height = $scope.text.marginDiscussionSizes[key] &&
              $scope.text.marginDiscussionSizes[key].height;
            return (key !== 'draft' && val.top !== undefined &&
                    height !==  undefined) ? 
                    {id: key, top: val.top, height: height} : undefined;
          })), 'top');

        var marginOffsets = {};

        // place draft
        if (draftTop && draftHeight) {
          marginOffsets.draft = draftTop;
        }

        var padding = 5;

        // treat above and below separately (no draft: draftTop === 0)
        var offsetsAbove = _.filter(offsets, function (offset) {
          return offset.top < draftTop;
        });
        var offsetsBelow = _.filter(offsets, function (offset) {
          return offset.top >= draftTop;
        });

        // move bottom elements from above to below if there's not enough space
        var getTotalHeight = function (offsets) {
          return _.sum(_.pluck(offsets, 'height')) + offsets.length * padding;
        };
        while (getTotalHeight(offsetsAbove) > draftTop) {
          // remove last one in above
          var last = offsetsAbove.splice(-1, 1);
          // insert to beginning of below
          offsetsBelow.unshift(last[0]);
        }

        // place offsets above the draft, i.e. above draftTop
        // (does nothing if no draft is visible)
        (function placeAbove() {

          // make sure we can always fit everything between topBarrier and
          // draftTop
          var topBarrier = 0;
          var remainingHeight = getTotalHeight(offsetsAbove);

          // place above elements top-down and pack when not enough space
          var offset;
          while ((offset = offsetsAbove.shift())) {
            var top = _.max([topBarrier, offset.top]);

            // doesn't fit with wanted top? pile 'em up close to draftTop
            if (top + remainingHeight > draftTop) {
              top = draftTop - remainingHeight;
            }
            marginOffsets[offset.id] = top;
            topBarrier = top + offset.height + padding;
            remainingHeight -= offset.height + padding;
          }
        })();

        // place offsets below the draft (or below 0) in 'open end' mode
        var topBarrier = draftTop && draftHeight ?
          draftTop + draftHeight + padding : 0;
        _.forEach(offsetsBelow, function (offset) {

          // do not fall above previously set offset
          var top = _.max([offset.top, topBarrier]);

          marginOffsets[offset.id] = top;
          topBarrier = top + offset.height + padding;
        });
        $scope.text.marginOffsets = marginOffsets;
      };
      $scope.$watch('text.highlightInfos', updateOffsets, true);
      $scope.$watch('text.marginDiscussionSizes', updateOffsets, true);
    }
  ]);
};
