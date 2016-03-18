'use strict';

import template from './template.html!text';

export default function(app) {
    app.component('navbarUser', {
      controller: [ '$scope', 'authService',
        function($scope, authService) {
          $scope.auth = authService;
        }],
      template,
    });
};
