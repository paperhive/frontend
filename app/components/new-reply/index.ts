'use strict';
import template from './template.html!text';

export default function(app) {
    app.component('newReply', {
      bindings: {
        onSubmit: '&',
      },
      controller: ['$scope',
        function($scope) {
          $scope.onSubmit = this.onSubmit;
          $scope.comment = {};
        }],
      template
    });
};
