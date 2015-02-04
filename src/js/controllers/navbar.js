module.exports = function (app) {
  app.controller('NavbarCtrl', ['$scope', function ($scope) {
    $scope.collapsed = true;
  }]);
};
