export default function(app) {
  app.component(
    'authReturn', {
      controller: [
        '$scope', '$routeParams', '$location', '$http', 'authService', 'config', 'notificationService',
        function($scope, $routeParams, $location, $http, authService, config, notificationService) {

          // if user is already logged in, redirect to '/'
          if (authService.user) {
            $location.url('/').replace();
            return;
          }

          function onLogin(data) {
            $location.url(data.returnUrl);
            if (data.personCreated) {
              notificationService.notifications.push({
                type: 'info',
                message: 'Welcome to PaperHive! You can set your username ' +
                  '<a href="./settings" class="alert-link">here</a>.',
              });
            }
          }

          function onLoginError(data) {
            notificationService.notifications.push({
              type: 'error',
              message: data.message,
            });
          }

          switch ($routeParams.provider) {
            case 'emailSignup':
              authService.signupEmailConfirm($routeParams.token)
              .then(onLogin, onLoginError);
              break;
            case 'emailAdd':
              $http.post(config.apiUrl + '/email/confirm', {token: $routeParams.token})
              .then(
                response => {
                  authService.user = response.data.person;
                  onLogin(response.data);
                },
                response => onLoginError(response.data),
              );
              break;
            case 'passwordReset':
              $location.url(`/password/reset?token=${$routeParams.token}`);
              break;
            case 'orcid':
            case 'google':
              authService.oauthConfirm($routeParams.provider, $routeParams.code, $routeParams.state)
              .then(onLogin, onLoginError);
              break;
            default:
              notificationService.notifications.push({
                type: 'error',
                message: `Authentication provider <em>${$routeParams.provider}</em> is unknown.`,
              });
          }

          $scope.auth = authService;
        },
      ],
    });
};
