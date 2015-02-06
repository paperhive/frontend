module.exports = function (app) {
  app.controller('SubNavCtrl', ['$scope', function ($scope) {
    $scope.collapsed = true;
  }]);
};
