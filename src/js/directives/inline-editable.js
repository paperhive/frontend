module.exports = function (app) {
  'use strict';

  app.directive('inlineEditable', function() {
    return {
      restrict: 'E',
      scope: {
        ngModel: '=',
        onSave: '&'
      },
      templateUrl: 'templates/directives/inline-editable.html',
      link: function (scope, element, attrs) {
        scope.c = {
          isEditMode: false
        };

        scope.reset = function() {
          scope.c.isEditMode = false;
        };

        scope.update = function(newContent) {
          scope.ngModel = newContent;
          scope.onSave({$content: newContent});
          scope.c.isEditMode = false;
        };
      }
    };
  });
};
