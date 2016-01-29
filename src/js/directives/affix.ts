'use strict';

const _ = require('lodash');
const $ = require('jquery');

module.exports = function(app) {

  app.directive(
    'affix',
    ['$window', '$timeout', '$parse', function($window, $timeout, $parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          const paramsDefault = {
            offsetTop: 0,
            offsetBottom: 0,
            useParentHeight: true
          };
          const params = _.clone(paramsDefault);

          // do not call reposition() for each parameter
          let init = true;

          // watch parameters
          scope.$watch(attrs.affixOffsetTop, function(offsetTop) {
            params.offsetTop = offsetTop !== undefined ? offsetTop :
              paramsDefault.offsetTop;
            if (!init) {reposition();}
          });
          scope.$watch(attrs.affixOffsetBottom, function(offsetBottom) {
            params.offsetBottom = offsetBottom !== undefined ? offsetBottom :
              paramsDefault.offsetBottom;
            if (!init) {reposition();}
          });
          scope.$watch(attrs.affixUseParentHeight, function(useParentHeight) {
            params.useParentHeight = useParentHeight !== undefined ?
              useParentHeight : paramsDefault.useParentHeight;
            if (!init) {reposition();}
          });

          function reposition() {
            // set height of element such that it fits the viewport
            // note: the 1px prevents scroll bars in certain situations
            const height = _.min([
              $($window).innerHeight() - params.offsetTop -
                params.offsetBottom - 1,
              element[0].scrollHeight
            ]);
            /* TODO: revisit
            element.css({height: height + 'px'});
            */

            // get position of parent
            const offsetParent = element[0].offsetParent;
            if (!offsetParent) {return;}
            const parentRect = offsetParent.getBoundingClientRect();

            // positioned normally
            let top = 0;
            let affixed = false;
            if (parentRect.top <= params.offsetTop) {
              affixed = true;
              if (params.useParentHeight &&
                  -parentRect.top + params.offsetTop + height >
                  parentRect.height) {
                // positioned at bottom of parent element
                top = parentRect.height - height;
              } else {
                // positioned at top
                top = -parentRect.top + params.offsetTop;
              }
            }

            element.css({top: top + 'px'});

            const affixedSetter = $parse(attrs.affixed);
            if (affixedSetter && affixedSetter.assign) {
              affixedSetter.assign(scope, affixed);
              scope.$apply();
            }
          }

          $timeout(function() {
            // register handler
            $($window).on('resize scroll', reposition);
            element.resize(reposition);

            // unregister handlers
            // $destroy seems to be emitted multiple times, so we only
            // clean up once
            let destroyed = false;
            element.on('$destroy', function() {
              $($window).off('resize scroll', reposition);
              if (!destroyed) {element.removeResize(reposition);}
              destroyed = true;
            });

            // run once
            init = false;
            reposition();
          });
        }
      };
    }]
  );

};
