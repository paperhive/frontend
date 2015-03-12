var angular = require('angular');
var $ = require('jquery');
module.exports = function (app) {
  'use strict';

  app.directive('subnav', ['$rootScope', '$routeSegment', '$filter',
    function($rootScope, $routeSegment, $filter) {
      return {
        restrict: 'E',
        templateUrl: 'templates/directives/subnav.html',
        transclude: true,
        scope: {},
        link: function (scope, element, attrs) {
          // collapsed by default
          scope.collapsed = true;

          // get ul
          var ul = element.find('ul')[0];
          if (!ul) return;

          var collapse = function () {
            $rootScope.$apply(function () {
              scope.collapsed = true;
            });
          };

          // collapse when focus is lost
          $(element).focusout(collapse);

          // iterate over li elements
          angular.forEach(ul.children, function (li) {
            // check li
            if (li.nodeName != 'LI') return;

            // get a
            var a = li.children[0];
            if (!a || a.nodeName != 'A') return;

            // target
            var target = angular.element(li).attr('subnav-target');

            // add link
            angular.element(a).attr(
              'href', '#' + $filter('routeSegmentUrl')(target)
            );

            // add click event
            $(a).click(collapse);

            // set active link class
            $rootScope.$watch(
              function () {return $routeSegment.name;},
              function (routeName) {
                var el = angular.element(li);
                if ($routeSegment.startsWith(target)) {
                  el.addClass('active');
                } else {
                  el.removeClass('active');
                }
              }
            );
          });
        }
      };
    }
  ]);
};
