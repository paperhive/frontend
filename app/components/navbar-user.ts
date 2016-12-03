export default function(app) {
  app.component('navbarUser', {
    controller: [ '$scope', 'authService', 'tourService',
      function($scope, authService, tourService) {
        $scope.auth = authService;
        $scope.tour = tourService;
      },
    ],
    template: require('./navbar-user.html'),
  });
};
