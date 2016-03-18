'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('inlineEditable', {
    bindings: {
      originalContent: '<',
      onSave: '&'
    },
    template,
    controller: [
      '$scope', 'authService',
      function($scope, authService) {
        const ctrl = this;

        $scope.$watch('$ctrl.originalContent', function(data) {
          $scope.content = data;
        });

        $scope.auth = authService;

        $scope.c = {
          isEditMode: false
        };

        $scope.reset = function() {
          $scope.c.isEditMode = false;
        };

        $scope.update = function(newContent) {
          ctrl.onSave({$content: newContent});
          $scope.c.isEditMode = false;
        };
      }
    ]
  });
};
