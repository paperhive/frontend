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
          $scope.text.highlightInfos.draft.top;
        var draftHeight = draftTop &&
          $scope.text.marginDiscussionSizes.draft &&
          $scope.text.marginDiscussionSizes.draft.height;

        var offsets = _.sortBy(_.compact(_.map(
          $scope.text.highlightInfos,
          function (val, key) {
            return key !== 'draft' ? {id: key, top: val.top} : undefined;
          })), 'top');
        console.log(offsets);
        var currentOffset = 0;

        marginOffsets = {};

        // place draft
        if (draftTop && draftHeight) {
          marginOffsets.draft = draftTop;
        }

        var padding = 5;

        // place all other discussions
        _.forEach(offsets, function (offset) {
          var height = $scope.text.marginDiscussionSizes[offset.id] &&
            $scope.text.marginDiscussionSizes[offset.id].height;
          if (!offset.top || !height) return;

          // do not fall above previously set offset
          var top = _.max([offset.top, currentOffset]);

          // if we don't have a draft: just place it to the first possible pos
          if (!draftTop || !draftHeight) {
            marginOffsets[offset.id] = top;
            currentOffset = top + height + padding;
            return;
          }

          // fits above draft: place it there
          if (top + height < draftTop - padding) {
            marginOffsets[offset.id] = top;
          // otherwise: place it below draft
          } else {
            marginOffsets[offset.id] = _.max([top, draftTop + draftHeight + padding]);
          }
          currentOffset = marginOffsets[offset.id] + height + padding;
        });
        $scope.text.marginOffsets = marginOffsets;
      };
      $scope.$watch('text.highlightInfos', updateOffsets, true);
      $scope.$watch('text.marginDiscussionSizes', updateOffsets, true);
    }
  ]);
};
