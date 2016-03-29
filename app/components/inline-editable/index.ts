'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('inlineEditable', {
    bindings: {
      originalContent: '<',
      canEdit: '<',
      onSave: '&'
    },
    template,
    controller: [
      '$scope',
      function($scope) {
        const ctrl = this;

        $scope.$watch('$ctrl.originalContent', function(data) {
          ctrl.content = data;
        });

        ctrl.c = {
          isEditMode: false
        };

        ctrl.reset = function() {
          ctrl.c.isEditMode = false;
          ctrl.content = ctrl.originalContent;
        };

        ctrl.update = function(newContent) {
          ctrl.onSave({$content: newContent});
          ctrl.c.isEditMode = false;
        };
      }
    ]
  });
};
