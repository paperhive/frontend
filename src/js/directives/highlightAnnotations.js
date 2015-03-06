var rangy = require('rangy');
var _ = require('lodash');
var $ = require('jquery');

module.exports = function (app) {

  // returns all leaf text nodes that are descendants of node or are node
  var getTextNodes = function (node) {
    if (!node) return [];
    if (node.nodeType === Node.TEXT_NODE) return [node];
    
    // process childs
    var nodes = [];
    $(node).contents().each(function (index, el) {
      nodes = nodes.concat(getTextNodes(el));
    });
    return nodes;
  };

  app.directive('highlightContainer', function () {
    return {
      restrict: 'A',
      transclude: true,
      replace: true,
      scope: {},
      template: '<div ng-transclude></div>',
      controller: ['$scope', function ($scope) {
      }]
    };
  });
  
  app.directive('highlightTarget', function () {
    return {
      restrict: 'A',
      require: '^^highlightContainer',
      link: function (scope, element, attrs, containerCtrl) {
        containerCtrl.getRects = function (serializedRanges) {
          if (!serializedRanges || !serializedRanges.length) return [];

          var containerRect = element[0].getBoundingClientRect();

          // deserialize range
          var ranges = _.map(serializedRanges, function (range) {
            return rangy.deserializeRange(range, element[0]);
          });

          // preserve current selection to work around browser bugs that result
          // in a changed selection
          // see https://github.com/timdown/rangy/issues/93
          // and https://github.com/timdown/rangy/issues/282
          var currentSelection = rangy.serializeSelection(
            rangy.getSelection(), true
          );

          // assumes that the DOM subtree is normalized
          // (see pdf directive)
          var rects = [];
          _.forEach(ranges, function (range) {
            //console.log(range);
            // split start container if necessary
            range.splitBoundaries();

            // get TextNodes inside the range
            var textNodes = _.filter(
              getTextNodes(range.commonAncestorContainer),
              function (node) {
                return range.containsNodeText(node);
              }
            );

            // wrap each TextNode in a span to measure it
            _.forEach(textNodes, function (node) {
              var $node = $(node);
              var $span = $node.wrap('<span/>').parent();
              var rect = $span.get(0).getBoundingClientRect();
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
      },
    };
  });
  
  app.directive('highlightRanges', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      require: '^^highlightContainer',
      templateUrl: 'templates/directives/highlightRanges.html',
      link: function (scope, element, attrs, containerCtrl) {
        scope.$watch(attrs.highlightRanges, function (ranges) {
          scope.rects = containerCtrl.getRects(ranges);
          console.log(scope.rects);
        }, true);
      }
    };
  }]);
};
