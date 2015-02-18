// TODO fetch from database
var users = [
  {
  _id: "08ea4",
  orcidId: "dasdasd0",
  userName: "hondi",
  displayName: "Hondanz",
  gravatarMd5: ""
},
{
  _id: "152ea4",
  orcidId: "dasdasd1",
  userName:  "hoppenstedt",
  displayName: "Opa Hoppenstedt",
  gravatarMd5: ""
},
{
  _id: "ea5411",
  orcidId: "dasdasd2",
  userName: "jimmy",
  displayName: "Jimmy",
  email: "jimmy@best.com",
  gravatarMd5: ""
}
];

module.exports = function (app) {
  app.controller('AnnotationCtrl', [
    '$scope', 'authService',
    function($scope, authService) {
      $scope.isEditMode = false;

      $scope.users = users;

      $scope.tmpBody = undefined;

      $scope.getPeopleText = function(item) {
        //return '<strong><a href="#/users/' + item.userName + '">@' + item.userName + '</a></strong>';
        return '@' + item.userName;
      };

      // For a more advanced example, using promises, see
      // <https://github.com/jeff-collins/ment.io/blob/master/ment.io/scripts.js>.
      $scope.searchPeople = function(term) {
        // Fill localItems, used as mentio-items in the respective directive.
        var results = [];
        angular.forEach($scope.users, function(item) {
          if (item.userName.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
            results.push(item);
          }
        });
        $scope.localItems = results;
      };

      $scope.updateAnnotation = function(newBody) {
        $scope.annotation.body = newBody;
        $scope.annotation.editTime = new Date();
        $scope.isEditMode = false;
      };

      // Needed for access from child scope
      $scope.setEditOn = function () {
        $scope.isEditMode = true;
        $scope.tmpBody = $scope.annotation.body;
      };

      // Needed for access from child scope
      $scope.setEditOff = function () {
        $scope.isEditMode = false;
      };
      //$scope.auth = authService;
      //$scope.annotationBody = null;
      //$scope.isEditMode = false;
      //
      // Warn on page close if there still is unsaved text in the reply form.
      $scope.$on('$locationChangeStart', function(event) {
        //console.log("isEditOn", $scope.isEditOn);
        //console.log("tmpBody === anno.body", $scope.tmpBody !== $scope.annotation.body);
        if ($scope.isEditOn && $scope.tmpBody !== $scope.annotation.body) {
          var answer = confirm("There is unsaved content in the reply field. Are you sure you want to leave this page?");
          if (!answer) {
            event.preventDefault();
          }
        }
      });
    }]);
};
