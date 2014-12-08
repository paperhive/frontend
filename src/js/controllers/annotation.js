module.exports = function (app) {
  app.controller('AnnotationCtrl', [
    '$scope', 'AuthService',
    function($scope, AuthService) {
      $scope.isEditMode = false;

      // Needed for access from child scope
      $scope.setEditOff = function () {
        $scope.isEditMode = false;
      };
      //$scope.auth = AuthService;
      //$scope.annotationBody = null;
      //$scope.isEditMode = false;

      //$scope.updateAnnotation = function(body) {
      //  $scope.annotationBody = body;
      //};
    }]);
};
