'use strict';

var angular = require('angular');

module.exports = function(app) {

  /* Usage: <div viewport-height>
   *
   * Sets the min-height of the element to the height of the viewport
   * at evaluation time. The height is *not* updated on resize events
   * in order to prevent resize flickering on mobile devices, e.g. when
   * a keyboard or navbar restricts the viewport.
   *
   */
  app.directive('viewportHeight', [
    '$window', '$timeout', function($window, $timeout) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var height = angular.element($window).height();
          element.css('min-height', height + 'px');
        }
      };
    }
  ]);
};

