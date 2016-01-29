'use strict';

module.exports = function(app) {

  app.controller('JobsCtrl', ['$scope', function($scope) {
    $scope.jobsData = {
      toc: []
    };
  }]);
};

