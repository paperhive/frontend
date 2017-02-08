export default function(app) {
  app.component('user', {
    controller: [
      '$scope', '$rootScope', '$routeSegment', 'config', '$http',
      'notificationService', 'authService', 'metaService',
      function(
        $scope, $rootScope, $routeSegment, config, $http,
        notificationService, authService, metaService,
      ) {
        // expose $routeSegment for subnav
        $scope.$routeSegment = $routeSegment;

        // expose auth for checking if this is the user's own profile
        $scope.auth = authService;

        // fetch user
        $http.get(`${config.apiUrl}/people/username/${$routeSegment.$routeParams.username}`).then(
          response => {
            $scope.user = response.data;
            metaService.set({
              title: `${response.data.account.username} (${response.data.displayName}) · PaperHive`,
              meta: [{
                name: 'description',
                content: `Profile of ${response.data.account.username} (${response.data.displayName}) on PaperHive.`,
              }],
            });
          },
          response => {
            notificationService.notifications.push({
              type: 'error',
              message: response.data.message,
            });
          },
        );
      },
    ],
    template: require('./user.html'),
  });
};
