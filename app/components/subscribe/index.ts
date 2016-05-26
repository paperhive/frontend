'use strict';

import template from './template.html';

export default function(app) {
  app.component(
    'subscribe', {
      template,
      controller: [
        '$scope', '$http', 'config',
        function($scope, $http, config) {

          $scope.hasError = function(field) {
            const form = $scope.subscribeForm;
            return (form.$submitted || form[field].$touched) &&
              form[field].$invalid;
          };

          $scope.$watch('email', function() {
            $scope.error = undefined;
          });

          $scope.submit = function() {
            $scope.subscribing = true;
            $scope.error = undefined;
            $http.post(config.apiUrl + '/newsletter/', {email: $scope.email})
            .then(function(response) {
              $scope.subscribing = false;
              $scope.subscribed = true;
            }, function(response) {
              $scope.subscribing = false;
              $scope.error = response.data && response.data.message ||
                'Unknown error';
            });

          };
        }
      ]}
  );
};
