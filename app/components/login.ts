export default function(app) {
  app.component('login', {
    controller: [
      '$scope', '$location', 'authService', '$http', 'config',
      function($scope, $location, authService, $http, config) {
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
            $scope.login.error = data || {message: 'Unknown error'};
          });
        };
      },
    ],
    template: require('./login.html'),
  });
};
