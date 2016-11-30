export default function(app) {
  app.component('jobs', {
    controller: ['$scope', function($scope) {
      $scope.jobsData = {
        toc: []
      };
    }],
    template: require('./jobs.html'),
  });
};
