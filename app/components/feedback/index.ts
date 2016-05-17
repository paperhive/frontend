'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('feedback', {
    bindings: {
      onCancel: '&',
      onSubmitted: '&',
    },
    controller: function($scope) {
      $scope.sendFeedback = {};

      $scope.hasError = function(field) {
        const form = $scope.form;
        return (form.$submitted || form[field].$touched) &&
          form[field].$invalid;
      };
      $scope.sendFeedback = function() {
        $scope.sendFeedback.inProgress = true;
        $scope.sendFeedback.error = undefined;
        //TODO
        $scope.sendFeedback.succeeded = true;
      };
    },
    template
  });
};