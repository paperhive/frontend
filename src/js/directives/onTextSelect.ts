'use strict';
const rangy = require('rangy');
const _ = require('lodash');

export default function(app) {

  app.directive('onTextSelect', ['$document', '$parse',
    function($document, $parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          let lastSerializedRanges;

          // define event handler
          const handler = function() {
            scope.$apply(function() {

              // result function
              const onTextSelect = function(selection) {

                let serializedRanges;

                // serialize ALL the ranges (if a selection is given)
                if (selection) {
                  serializedRanges = _.map(
                    selection.getAllRanges(),
                    function(range) {
                      return rangy.serializeRange(range, true, element[0]);
                    }
                  );
                }

                // only call expression if something happened
                // (otherwise every keypress calls the expression)
                if (!_.isEqual(serializedRanges, lastSerializedRanges)) {
                  lastSerializedRanges = serializedRanges;

                  let target;
                  // construct target object if valid ranges are given
                  if (serializedRanges && serializedRanges.length &&
                      selection) {
                    target = {
                      text: selection.toString(),
                      ranges: serializedRanges
                    };
                  }

                  $parse(attrs.onTextSelect)(scope, {$target: target});
                }
              };

              // get current selection
              const selection = rangy.getSelection();

              // no selection object or no anchor/focus
              if (!selection || !selection.anchorNode || !selection.focusNode) {
                return onTextSelect();
              }

              // check if current selection starts or ends in element
              const anchor = selection.anchorNode;
              const focus = selection.focusNode;

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

              return onTextSelect(selection);
            });
          };

          // register event handler
          $document.on('mouseup keyup', handler); // key events are not fired on PDFs
        }
      };
    }
  ]);
};
