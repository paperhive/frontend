'use strict';

export default function(app) {

  app.controller('HelpCtrl', ['$scope', function($scope) {
    $scope.helpData = {
      toc: []
    };
  }]);
};
