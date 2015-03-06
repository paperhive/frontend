var rangy = require('rangy');
var _ = require('lodash');

module.exports = function (app) {

  app.directive('onTextSelect', ['$document', '$parse',
    function ($document, $parse) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var lastRanges;

          // define event handler
          var handler = function () {
            scope.$apply(function () {
              // result function
              var onTextSelect = function (ranges, selection) {
                if (!_.isEqual(ranges, lastRanges)) {
                  lastRanges = ranges;

                  var target;
                  // construct target object if valid ranges are given
                  if (ranges && ranges.length && selection) {
                    target = {
                      text: selection.toString(),
                      ranges: ranges
                    };
                  }

                  $parse(attrs.onTextSelect)(scope, {$target: target});
                }
              };

              // get current selection
              var selection = rangy.getSelection();

              // no selection object or no anchor/focus
              if (!selection || !selection.anchorNode || !selection.focusNode) {
                return onTextSelect();
              }

              // check if current selection starts or ends in element
              var anchor = selection.anchorNode;
              var focus = selection.focusNode;

              // selection not contained in element?
              if (!rangy.dom.isAncestorOf(element[0], anchor) ||
                  !rangy.dom.isAncestorOf(element[0], focus)) {
                return onTextSelect();
              }

              // do not allow collapsed / empty selections
              if (!selection.toString()) {
                return onTextSelect();
              }

              // do not allow selections without a range
              // (André: I guess that's possible in crazy browsers)
              if (!selection.rangeCount) {
                return onTextSelect();
              }

              // serialize ALL the ranges
              var serializedRanges = _.map(
                selection.getAllRanges(),
                function (range) {
                  return rangy.serializeRange(
                    selection.getRangeAt(0), true, element[0]
                  );
                }
              );

              return onTextSelect(serializedRanges, selection);
            });
          };

          // register event handler
          $document.on('mouseup keyup', handler); // key events are not fired on PDFs
        }
      };
  }
  ]);
};
