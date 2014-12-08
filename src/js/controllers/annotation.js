module.exports = function (app) {
  app.controller('AnnotationCtrl', [
    '$scope', 'AuthService',
    function($scope, AuthService) {
      $scope.isEditMode = false;

      $scope.updateAnnotation = function(newBody) {
        $scope.annotation.body = newBody;
        $scope.annotation.editTime = new Date();
        $scope.isEditMode = false;
      }

      // Needed for access from child scope
      $scope.setEditOn = function () {
        $scope.isEditMode = true;
        $scope.tmpBody = $scope.annotation.body;
      };

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
