'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('activity', {
    bindings: {
      personId: '<',
    },
    controller: [
    '$scope', '$element', '$attrs', '$http', 'config', 'notificationService',
      function($scope, $element, $attrs, $http, config, notificationService) {

        const ctrl = this;

        $http.get(
          config.apiUrl + `/activities/`
        )
        .success(function(ret) {
          $scope.activities = ret.activities;
        })
        .error(function(data) {
          notificationService.notifications.push({
            type: 'error',
            message: data.message ? data.message :
              'could not fetch activities (unknown reason)'
          });
        });

        // TODO filter person="user.id", document, discussion
        // <activities person="user.id" ...></activities>


      }
    ],
    template: template,
  });
};
