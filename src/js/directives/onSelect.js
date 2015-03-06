var rangy = require('rangy');
var _ = require('lodash');

module.exports = function (app) {
  app.directive('onSelect', ['$document', '$parse',
    function ($document, $parse) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var lastRanges;

          // define event handler
          var handler = function () {
            scope.$apply(function () {
              // result function
              var onSelect = function (ranges) {
                if (!_.isEqual(ranges, lastRanges)) {
                  lastRanges = ranges;
                  $parse(attrs.onSelect)(scope, {$ranges: ranges});
                }
              };

              // get current selection
              var selection = rangy.getSelection();

              // no selection object or no anchor/focus
              if (!selection || !selection.anchorNode || !selection.focusNode) {
                return onSelect(undefined);
              }

              // check if current selection starts or ends in element
              var anchor = selection.anchorNode;
              var focus = selection.focusNode;

              // selection not contained in element?
              if (!rangy.dom.isAncestorOf(element[0], anchor) ||
                  !rangy.dom.isAncestorOf(element[0], focus)) {
                return onSelect(undefined);
              }

              // do not allow collapsed / empty selections
              if (!selection.toString()) {
                return onSelect(undefined);
              }

              // do not allow selections without a range
              // (André: I guess that's possible in crazy browsers)
              if (!selection.rangeCount) {
                return onSelect(undefined);
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

              return onSelect(serializedRanges);
            });
          };

          // register event handler
          $document.on('mouseup keyup', handler); // key events are not fired on PDFs
          //element.on('mouseup', handler);
        }
      };
  }
  ]);
};
