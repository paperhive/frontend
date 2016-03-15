'use strict';
import template from './template.html!text';

export default function(app) {
    app.component('newReply', {
      bindings: {
        onSubmit: '&',
      },
      controller: ['$scope',
        function($scope) {
          const ctrl = this;
          console.log(ctrl);
          $scope.onSubmit = ctrl.onSubmit;
          console.log($scope.onSubmit);
          $scope.comment = {};
        }],
      template
    });
};
