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
  var userLookup = {};
  for (var i = 0, len = allUsers.length; i < len; i++) {
    userLookup[allUsers[i].userName] = allUsers[i];
  }
  var userLookupById = {};
  for (var i = 0, len = allUsers.length; i < len; i++) {
    userLookupById[allUsers[i]._id] = allUsers[i];
  }
  // END debug code

  app.controller('UserCtrl', [
    '$scope', '$routeSegment', 'config', 'authService',
    function ($scope, $routeSegment, config, authService) {
      $scope.config = config;
      $scope.auth = authService;

      $scope.users = allUsers;

      $scope.user = userLookup[$routeSegment.$routeParams.username];

      $scope.getUserById = function (id) {
        return userLookupById[id];
      };
    }
  ]);
};
