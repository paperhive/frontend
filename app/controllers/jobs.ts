'use strict';

export default function(app) {

  app.controller('JobsCtrl', ['$scope', function($scope) {
    $scope.jobsData = {
      toc: []
    };
  }]);
};

