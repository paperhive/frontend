'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('feedback', {
    bindings: {
      onCancel: '&',
      onSubmitted: '&',
    },
    controller: ['$scope', function($scope) {
      $scope.hasError = function(field) {
        const form = $scope.form;
        return (form.$submitted || form[field].$touched) &&
          form[field].$invalid;
      };
      $scope.submit = function(){
        //TODO
      };
    }],
    template
  });
};