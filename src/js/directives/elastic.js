'use strict';

var $ = require('jquery');

module.exports = function(app) {

  app.directive('elastic', [
    '$timeout', '$document',
    function($timeout, $document) {
      return {
        restrict: 'A',
        link: function($scope, element) {

          var mirror = $('<textarea></textarea>');
          mirror.attr('class', element.attr('class'));
          mirror.css({
            position: 'absolute',
            height: 'auto',
            display: 'none',
            visibility: 'hidden'
          });

          $($document[0].body).append(mirror);

          var update = function() {
            // set to block temporarily
            mirror.css('display', 'block');

            // set width
            mirror.width(element.width());

            // append a newline (otherwise the content flickers)
            mirror[0].value = element[0].value + '\n';

            // measure and set height
            var newHeight = mirror[0].scrollHeight;
            if (newHeight) {
              element[0].style.height = newHeight + 'px';
            } else {
              delete element[0].style.height;
            }

            // set back to display none
            mirror.css('display', 'none');
          };

          // attach handler
          element.on('change blur keydown keypress keyup', function() {
            $timeout(update, 0)
          });
          //element.resize(update);

          // remove handler and mirror element
          //var destroyed = false;
          element.on('$destroy', function () {
            mirror.remove();

            //if (!destroyed) {element.removeResize(update);}
            //destroyed = true;
          });

          $timeout(update, 0);
        }
      };
    }
  ]);

};
