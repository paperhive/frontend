'use strict';
module.exports = function(app) {

  app.directive('ngConfirmClick', [
    function() {
    return {
      link: function(scope, element, attr) {
        var msg = attr.ngConfirmClick || 'Are you sure?';
        var clickAction = attr.confirmedClick;
        element.bind('click', function(event) {
          if (window.confirm(msg)) {
            scope.$apply(clickAction);
          }
        });
      }
    };
  }]);

};
