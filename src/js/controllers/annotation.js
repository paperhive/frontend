module.exports = function (app) {
  app.controller('AnnotationCtrl', [
    '$scope', 'AuthService',
    function($scope, AuthService) {
      $scope.auth = AuthService;
      $scope.annotationBody = null;
    }]);
};
