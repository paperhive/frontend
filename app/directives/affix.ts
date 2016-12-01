import { clone, min} from 'lodash';
import * as jquery from 'jquery';

export default function(app) {
  app.directive(
    'affix',
    ['$window', '$timeout', function($window, $timeout) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          const paramsDefault = {
            offsetTop: 0,
            offsetBottom: 0,
            useParentHeight: true,
          };
          const params = clone(paramsDefault);

          function reposition() {
            // set height of element such that it fits the viewport
            // note: the 1px prevents scroll bars in certain situations
            const height = min([
              jquery($window).innerHeight() - params.offsetTop -
                params.offsetBottom - 1,
              element[0].scrollHeight
            ]);
            element.css({height: height > 0 ? height + 'px' : 'auto'});

            // get position of parent
            const offsetParent = element[0].offsetParent;
            if (!offsetParent) { return; }
            const parentRect = offsetParent.getBoundingClientRect();

            // positioned normally
            let top = 0;
            let affixed = false;

            if (parentRect.top >= params.offsetTop) {
              // not affixed (aka affixed to top of container)
              element.css({position: 'static', top: 0});
            } else {
              affixed = true;
              if (parentRect.top + parentRect.height < height + params.offsetTop) {
                // affixed to bottom of container
                element.css({position: 'relative', top: parentRect.height - height});
              } else {
                // affixed to top of viewport (plus offsetTop)
                element.css({
                  position: 'relative',
                  top: -parentRect.top + params.offsetTop,
                });
              }
            }
          }

          $timeout(function() {
            // register handler
            jquery($window).on('resize scroll', reposition);
            element.resize(reposition);

            // unregister handlers
            // $destroy seems to be emitted multiple times, so we only
            // clean up once
            let destroyed = false;
            element.on('$destroy', function() {
              jquery($window).off('resize scroll', reposition);
              if (!destroyed) { element.removeResize(reposition); }
              destroyed = true;
            });

            // run once and reposition if parameters change
            scope.$watchGroup(
              [attrs.affixOffsetTop, attrs.affixOffsetBottom, attrs.affixUseParentHeight],
              (vals) => {
                params.offsetTop = vals[0] || paramsDefault.offsetTop;
                params.offsetBottom = vals[1] || paramsDefault.offsetBottom;
                params.useParentHeight = vals[2] !== undefined ?
                  vals[2] : paramsDefault.useParentHeight;
              }
            );
          });
        }
      };
    }]
  );

};
