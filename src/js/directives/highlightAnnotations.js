var rangy = require('rangy');
var _ = require('lodash');

module.exports = function (app) {
  app.directive('highlightAnnotations', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var offsetsGetter = $parse(attrs.highlightOffsets);

        // instanciate highlighter
        var highlighter = rangy.createHighlighter();
        highlighter.addClassApplier(rangy.createClassApplier("ph-highlight", {
          ignoreWhiteSpace: true,
          tagNames: ["span", "a"]
        }));

        function addAnnotation (annotation) {
          if (!annotation.selection) return;

          // deserialize
          var selection = rangy.deserializeSelection(annotation.selection,
                                                     element[0]);

          // highlight
          highlighter.highlightSelection('ph-highlight', {
            selection: selection
          });

          // get offset
          function getOffset (el) {
            var offset = {x: 0, y: 0};
            while (el !== element[0]) {
              offset.x += el.offsetLeft || 0;
              offset.y += el.offsetTop || 0;
              el = el.parentNode;
            }
            return offset;
          }
          var anchorOffset = getOffset(selection.anchorNode);
          var focusOffset = getOffset(selection.focusNode);
          var offset = {
            x: Math.min(anchorOffset.x, focusOffset.x),
            y: Math.min(anchorOffset.y, focusOffset.y)
          };

          // store offset
          var offsets = offsetsGetter(scope);
          if (offsets) {
            offsets[annotation._id] = offset;
          }

          // get rid of selection
          selection.detach();
        }

        scope.$watch(attrs.highlightAnnotations, function (annotations) {
          highlighter.removeAllHighlights();
          _.forEach(annotations, addAnnotation);
        }, true);
      }
    };
  }]);
};
