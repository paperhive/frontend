'use strict';

import template from './template.html';

export default function(app) {
  app.component(
    'login', {
      template,
      controller: [
        '$http', '$location', '$sce', '$scope', 'authService', 'config',
        function($http, $location, $sce, $scope, authService, config) {
          $scope.auth = authService;

          $scope.login = {};

          $scope.hasError = function(field) {
            const form = $scope.loginForm;
            return (form.$submitted || form[field].$touched) &&
              form[field].$invalid;
          };

          $scope.sendLogin = function() {
            $scope.login.inProgress = true;
            $scope.login.error = undefined;

            authService
            .loginEmail($scope.login.emailOrUsername, $scope.login.password)
            .then(function(data) {
              $scope.login.inProgress = false;
              $scope.login.succeeded = true;
              $location.url(authService.returnPath);
            }, function(data) {
              $scope.login.inProgress = false;
              if (data && data.status === 401 && data.message === 'Invalid credentials.') {
                $scope.login.error = $sce.trustAsHtml(`<i class="fa fa-fw fa-times"></i> Sorry, we don't
                  recognize those credentials. If you forgot your password click
                  <a style="cursor: pointer;" href="./password/request?{{
                  {returnPath: auth.returnPath, emailOrUsername: login.emailOrUsername} |
                  queryString }}">here</a>.`);
              } else {
                $scope.login.error = data && data.message || `<i class="fa fa-fw fa-times"></i> Unknown error`;
              }
            });
          };
        }
      ]}
  );
};
