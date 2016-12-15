// TODO: ts complains about missing default export but this works!
import jquery from 'jquery';

export default function(app) {
  function registerOutsideDirective(eventName, directiveName) {
    app.directive(directiveName, [
      '$parse', '$document',
      function($parse, $document) {
        return {
          restrict: 'A',
          link: (scope, element, attrs) => {
            const handler = function(event) {
              // determine if clicked inside the element
              const clickedInside = jquery.contains(element[0], event.target);

              // check if event has to be fired
              if (!clickedInside) {
                // get callback that was specified in attribute
                const callback = $parse(attrs[directiveName]);

                // wrap the call in a scope.$apply to make sure Angular
                // updates the scope on changes
                scope.$apply(function() {
                  callback(scope, {$event: event});
                });
              }
            };

            // register handler
            $document.on(eventName, handler);

            // unregister handler on destruction of element
            element.on('$destroy', function() {
              $document.off(eventName, handler);
            });

          },
        };
      },
    ]);
  }

  registerOutsideDirective('mousedown', 'onOutsideMousedown');
  registerOutsideDirective('mouseup', 'onOutsideMouseup');
  registerOutsideDirective('click', 'onOutsideClick');
};
