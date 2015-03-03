var rangy = require('rangy');

module.exports = function (app) {
  app.directive('onSelect', ['$document', '$parse',
    function ($document, $parse) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var currentSelection;

          // define event handler
          var handler = function () {
            scope.$apply(function () {
              // result function
              var onSelect = function (selection) {
                if (selection || selection !== currentSelection) {
                  currentSelection = selection;
                  $parse(attrs.onSelect)(scope, {$selection: selection});
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

              return onSelect(selection);
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
