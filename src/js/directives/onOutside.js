$ = require('jquery');

module.exports = function (app) {
  function registerOutsideDirective (eventName, directiveName) {
    app.directive(directiveName, [
      '$parse', '$document',
      function ($parse, $document) {
        return {
          restrict: 'A',
          link: function (scope, element, attrs) {
            var handler = function(event) {
              // determine if clicked inside the element
              var clickedInside = $.contains(element[0], event.target);

              // get callback that was specified in attribute
              var callback = $parse(attrs[directiveName]);

              // check if event has to be fired
              if (!clickedInside && callback) {
                // wrap the call in a scope.$apply to make sure Angular
                // updates the scope on changes
                scope.$apply(function () {
                  callback(scope, {$event: event});
                });
              }
            };

            // register handler
            $document.on(eventName, handler);

            // unregister handler on destruction of element
            element.on('$destroy', function () {
              $document.off(eventName, handler);
            });

          }
        };
      }
    ]);
  }

  registerOutsideDirective('mousedown', 'onOutsideMousedown');
  registerOutsideDirective('mouseup', 'onOutsideMouseup');
  registerOutsideDirective('click', 'onOutsideClick');
};
