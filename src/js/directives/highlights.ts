import rangy = require('rangy');
import * as _ from 'lodash';
import * as jquery from 'jquery';

export default function(app) {

  // returns all leaf text nodes that are descendants of node or are node
  const getTextNodes = function(node) {
    if (!node) { return []; }
    if (node.nodeType === Node.TEXT_NODE) { return [node]; }

    // process childs
    let nodes = [];
    jquery(node).contents().each(function(index, el) {
      nodes = nodes.concat(getTextNodes(el));
    });
    return nodes;
  };

  app.directive('highlightContainer', function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', function($scope) {
      }]
    };
  });

  app.directive('highlightRoot', function() {
    return {
      restrict: 'A',
      require: '^^highlightContainer',
      link: function(scope, element, attrs, containerCtrl) {
        containerCtrl.getRangesRects = function(serializedRanges) {
          if (!serializedRanges || !serializedRanges.length) { return []; }

          const containerRect = element[0].getBoundingClientRect();

          // deserialize range
          const ranges = _.map(serializedRanges, function(range) {
            return rangy.deserializeRange(range, element[0]);
          });

          // preserve current selection to work around browser bugs that result
          // in a changed selection
          // see https://github.com/timdown/rangy/issues/93
          // and https://github.com/timdown/rangy/issues/282
          const currentSelection = rangy.serializeSelection(
            rangy.getSelection(), true
          );

          // assumes that the DOM subtree is normalized
          // (see pdf directive)
          const rects = [];
          _.forEach(ranges, function(range) {
            // split start container if necessary
            range.splitBoundaries();

            // get TextNodes inside the range
            const textNodes = _.filter(
              getTextNodes(range.commonAncestorContainer),
              range.containsNodeText,
              range
            );

            // wrap each TextNode in a span to measure it
            // See this discussion:
            // https://github.com/paperhive/paperhive-frontend/pull/68#discussion_r25970589
            _.forEach(textNodes, function(node) {
              const $node = jquery(node);
              const $span = $node.wrap('<span/>').parent();
              const rect = $span.get(0).getBoundingClientRect();
              $node.unwrap();

              rects.push({
                top: rect.top - containerRect.top,
                left: rect.left - containerRect.left,
                width: rect.width,
                height: rect.height
              });
            });

            // re-normalize to undo splitBoundaries
            range.normalizeBoundaries();
          });

          // restore selection (see above)
          if (currentSelection) {
            rangy.deserializeSelection(currentSelection);
          }

          return rects;
        };
      }
    };
  });

  app.directive('highlightTarget', ['$parse', function($parse) {
    return {
      restrict: 'A',
      require: '^^highlightContainer',
      scope: {
        highlightTarget: '=',
        highlightInfo: '=',
        highlightBorder: '='
      },
      templateUrl: 'templates/directives/highlightTarget.html',
      link: function(scope, element, attrs, containerCtrl) {
        scope.$watch('highlightTarget', function(target) {
          if (!target) {
            scope.rects = undefined;
            scope.highlightInfo = undefined;
            return;
          }

          if (target.ranges.length) {
            scope.rects = containerCtrl.getRangesRects(target.ranges);

            // gather bbox information and expose it on the scope
            const info = {
              left: _.min(_.pluck(scope.rects, 'left')),
              right: _.max(_.map(scope.rects, function(rect) {
                return rect.left + rect.width;
              })),
              top: _.min(_.pluck(scope.rects, 'top')),
              bottom: _.max(_.map(scope.rects, function(rect) {
                return rect.top + rect.height;
              })),
              width: undefined,
              height: undefined,
            };
            info.width = info.right - info.left;
            info.height = info.bottom - info.top;
            scope.highlightInfo = info;
          }
        }, true);
      }
    };
  }]);
};
