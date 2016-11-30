export default function(app) {
  app.component('navbar', {
    controller : ['$routeSegment', '$scope', 'tourService',
        function($routeSegment, $scope, tourService) {
      $scope.collapsed = true;

      $scope.tour = tourService;
      $scope.$routeSegment = $routeSegment;
    }],
    template: require('./navbar.html'),
  });
};
