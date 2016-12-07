export default function(app) {
  app.directive('ngConfirmClick', [
    function() {
      return {
        link: (scope, element, attr) => {
          const msg = attr.ngConfirmClick || 'Are you sure?';
          const clickAction = attr.confirmedClick;
          element.bind('click', function(event) {
            if (window.confirm(msg)) {
              scope.$apply(clickAction);
            }
          });
        },
      };
    }]);
};
