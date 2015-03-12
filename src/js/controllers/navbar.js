module.exports = function (app) {
  'use strict';

  app.controller('NavbarCtrl', ['$scope', function ($scope) {
    $scope.collapsed = true;
  }]);
};
