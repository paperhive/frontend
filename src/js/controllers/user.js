module.exports = function (app) {
  // BEGIN debug code
  allUsers = [
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
  // create lookup array for debugging purposes
  var lookup = {};
  for (var i = 0, len = allUsers.length; i < len; i++) {
    lookup[allUsers[i].userName] = allUsers[i];
  }
  // END debug code

  app.controller('UserCtrl', [
    '$scope', '$routeSegment', 'config', 'AuthService',
    function ($scope, $routeSegment, config, authService) {
      $scope.config = config;
      $scope.auth = authService;

      $scope.users = allUsers;

      $scope.user = lookup[$routeSegment.$routeParams.username];
    }
  ]);
};
