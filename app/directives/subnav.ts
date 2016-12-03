import * as angular from 'angular';
import * as jquery from 'jquery';

export default function(app) {

  app.directive('subnav', ['$rootScope', '$routeSegment', '$filter',
    function($rootScope, $routeSegment, $filter) {
      return {
        restrict: 'E',
        template: require('./subnav.html'),
        transclude: true,
        scope: {},
        link: (scope, element, attrs) => {
          // collapsed by default
          scope.collapsed = true;

          // get ul
          const ul = element.find('ul')[0];
          if (!ul) {
            return;
          }

          const collapse = function() {
            $rootScope.$apply(function() {
              scope.collapsed = true;
            });
          };

          // collapse when focus is lost
          jquery(element).focusout(collapse);

          // iterate over li elements
          angular.forEach(ul.children, function(li) {
            // check li
            if (li.nodeName !== 'LI') {
              return;
            }

            // get a
            const a = li.children[0];
            if (!a || a.nodeName !== 'A') {
              return;
            }

            // target
            const target = angular.element(li).attr('subnav-target');

            // add link
            angular.element(a).attr(
              'href', './' + $filter('routeSegmentUrl')(target),
            );

            // add click event
            jquery(a).click(collapse);

            // set active link class
            $rootScope.$watch(
              function() { return $routeSegment.name; },
              function(routeName) {
                const el = angular.element(li);
                if ($routeSegment.startsWith(target)) {
                  el.addClass('active');
                } else {
                  el.removeClass('active');
                }
              },
            );
          });
        },
      };
    },
  ]);
};
