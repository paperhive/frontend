module.exports = function (app) {

  app.directive('inlineEditable', function() {
    return {
      restrict: 'E',
      require: 'ngModel',
      scope: {
        ngModel: '=',
        onSave: '&'
      },
      templateUrl: 'templates/directive/inline-editable.html',
      link: function (scope, element, attrs, ngModelCtrl) {
        console.log(ngModelCtrl.$modelValue);
        console.log(ngModelCtrl.$viewValue);
        scope.c = {
          isEditMode: false,
          updatedContent: scope.content
        };
      }
    };
  });
};
