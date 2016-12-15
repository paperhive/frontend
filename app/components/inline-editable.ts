export default function(app) {
  app.component('inlineEditable', {
    bindings: {
      content: '<',
      canEdit: '<',
      onSubmit: '&',
    },
    controller: ['$scope', '$q', function($scope, $q) {
      const $ctrl = this;

      $scope.$watch('$ctrl.content', content => $ctrl.contentCopy = content);
      $ctrl.isEditMode = false;

      $ctrl.reset = () => {
        $ctrl.contentCopy = $ctrl.content;
        $ctrl.isEditMode = false;
      };

      $ctrl.submit = (newContent) => {
        $ctrl.submitting = true;
        $q.when($ctrl.onSubmit({content: newContent}))
          .then(() => $ctrl.isEditMode = false)
          .finally(() => $ctrl.submitting = false);
      };
    }],
    template: require('./inline-editable.html'),
  });
};
