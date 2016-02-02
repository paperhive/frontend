'use strict';
export default function(app) {

  app.directive('inlineEditable', [
    'authService',
    function(authService) {
      return {
        restrict: 'E',
        scope: {
          ngModel: '=',
          onSave: '&'
        },
        templateUrl: 'templates/directives/inline-editable.html',
        link: function(scope, element, attrs) {
          scope.auth = authService;

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
    }]);
};
