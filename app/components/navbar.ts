require('./onboarding.less');

export default function(app) {
  app.component('navbar', {
    controller : ['$routeSegment', '$scope',
        function($routeSegment, $scope) {
      $scope.collapsed = true;

      $scope.$routeSegment = $routeSegment;
    }],
    template: require('./navbar.html'),
  });
};
