'use strict';
var _ = require('lodash');

module.exports = function (app) {

  app.controller('ArticleTextCtrl', [
    '$scope', '$route', '$routeSegment', '$document', '$http', 'config',
    'authService', 'notificationService', 'distangleService',
    function($scope, $route, $routeSegment, $document, $http, config,
             authService, notificationService, distangleService) {

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

        // padding between elements
        var padding = 8;
        var ids = _.pluck(offsets, 'id');
        var anchors = _.pluck(offsets, 'top');
        var heights = _.map(_.pluck(offsets, 'height'), function (height) {
          return height + padding;
        });
        var optOffsets = distangleService.distangle(
          anchors, heights, 0
        );

        // result
        var marginOffsets = {};

        // place draft
        if (draftTop && draftHeight) {
          marginOffsets.draft = draftTop;
        }

        // treat above and below separately (no draft: draftTop === 0)
        var offsetsAbove = _.filter(offsets, function (offset) {
          return offset.top <= draftTop;
        });
        var offsetsBelow = _.filter(offsets, function (offset) {
          return offset.top > draftTop;
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

        var place = function (offsets, lb, ub) {
          var ids = _.pluck(offsets, 'id');
          var anchors = _.pluck(offsets, 'top');
          var heights = _.map(_.pluck(offsets, 'height'), function (height) {
            return height + padding;
          });
          var optOffsets = distangleService.distangle(anchors, heights, lb, ub);
          var i;
          for (i = 0; i < anchors.length; i++) {
            marginOffsets[ids[i]] = optOffsets[i];
          }

        };

        if (offsetsAbove.length) {
          place(offsetsAbove, 0, draftTop);
          place(offsetsBelow, draftTop + draftHeight + padding);
        } else {
          place(offsetsBelow, 0);
        }

        $scope.text.marginOffsets = marginOffsets;
        return;
      };
      $scope.$watch('text.highlightInfos', updateOffsets, true);
      $scope.$watch('text.marginDiscussionSizes', updateOffsets, true);
    }
  ]);
};
