export default function(app) {
  app.component('navbarUser', {
    controller: [ '$scope', 'authService',
      function($scope, authService) {
        $scope.auth = authService;
      },
    ],
    template: require('./navbar-user.html'),
  });
};
