'use strict';

module.exports = function(app) {

  app.controller('HelpCtrl', ['$scope', function($scope) {
    $scope.helpData = {
      toc: []
    };
  }]);
};
