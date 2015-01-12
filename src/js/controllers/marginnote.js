module.exports = function (app) {
  app.controller('MarginNoteCtrl', [
    '$scope',
    function($scope) {
      $scope.offsetPx = undefined;
      $scope.text = undefined;
    }]);
};
