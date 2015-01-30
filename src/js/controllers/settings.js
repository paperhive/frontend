var _ = require('lodash');

module.exports = function (app) {
  app.controller('SettingsCtrl', ['$scope', '$http', 'config', 'authService',
    function ($scope, $http, config, authService) {
      $scope.tab = 'profile';
      $scope.auth = authService;
      $scope.$watch('auth.user', function (user) {
        $scope.user = _.cloneDeep(user);
      });
      $scope.save = function () {
        var obj = _.cloneDeep($scope.user);
       
        // remove all keys which we are not allowed to set
        var deleteKeys = ['_id', 'accounts', 'email', 'gravatarMd5'];
        _.forEach(deleteKeys, function (key) { delete obj[key]; });

        // save
        $http.put(config.api_url + '/users/' + $scope.user._id, obj).
          success(function (data) {
            authService.setUser(data);
          }).
          error(function (data) {
            console.log(data);
          });
      };
    }
  ]);
};
