'use strict';

const $ = require('jquery');

export default function(app) {

  // elastic textarea based on a mirror technique similar to
  // https://github.com/monospaced/angular-elastic/blob/master/elastic.js
  // (the version here is much shorter)
  app.directive('elastic', [
    '$timeout', '$document',
    function($timeout, $document) {
      return {
        restrict: 'A',
        link: function($scope, element) {

          const mirror = $('<textarea></textarea>');
          mirror.attr('class', element.attr('class'));
          mirror.css({
            position: 'absolute',
            height: 'auto',
            display: 'none',
            visibility: 'hidden'
          });

          $($document[0].body).append(mirror);

          const update = function() {
            // set to block temporarily
            mirror.css('display', 'block');

            // set width
            mirror.width(element.width());

            // append a newline (otherwise the content flickers)
            mirror[0].value = element[0].value + '\n';

            // measure and set height
            const newHeight = mirror[0].scrollHeight;
            if (newHeight) {
              element[0].style.height = newHeight + 'px';
            } else {
              delete element[0].style.height;
            }

            // set back to display none
            mirror.css('display', 'none');
          };

          // attach handler
          // (uses all key events to be on the safe side... browsers emit
          // these events in different ways)
          element.on('change blur keydown keypress keyup', function() {
            $timeout(update, 0);
          });
          // element.resize(update);

          // remove handler and mirror element
          // const destroyed = false;
          element.on('$destroy', function() {
            mirror.remove();

            // if (!destroyed) {element.removeResize(update);}
            // destroyed = true;
          });

          $timeout(update, 0);
        }
      };
    }
  ]);

};
