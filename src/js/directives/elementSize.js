'use strict';
module.exports = function(app) {

  app.directive('elementSize', ['$parse', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var size = {};
        var resizeHandler = function(e) {
          var height = element[0].offsetHeight;
          var width = element[0].offsetWidth;

          // return if unchanged
          if (size.height === height && size.width === width) {return;}

          size.height = height;
          size.width = width;

          var setter = $parse(attrs.elementSize);
          if (setter && setter.assign) {
            setter.assign(scope, size);
            if (e) {
              scope.$apply();
            }
          }
        };

        // attach event handler
        element.resize(resizeHandler);

        // detach event handler upon destruction of element
        // $destroy seems to be emitted multiple times, so we only
        // clean up once
        var destroyed = false;
        element.on('$destroy', function() {
          if (!destroyed) {element.removeResize(resizeHandler);}
          destroyed = true;
        });

        // call handler once
        resizeHandler();
      }
    };
  }]);
};
