var _ = require('lodash');

module.exports = function (app) {
  app.controller('SettingsCtrl', ['$scope', '$http', 'config', 'authService',
    function ($scope, $http, config, authService) {
      $scope.tab = 'profile';
      $scope.auth = authService;

      // keep user copy up to date
      $scope.$watch('auth.user', function (user) {
        $scope.user = _.cloneDeep(user);
      });

      // save to api
      $scope.save = function () {
        $scope.busy = true;

        var obj = _.cloneDeep($scope.user);
       
        // remove all keys which we are not allowed to set
        var deleteKeys = ['_id', 'accounts', 'email', 'gravatarMd5'];
        _.forEach(deleteKeys, function (key) { delete obj[key]; });

        // save
        $http.put(config.api_url + '/users/' + $scope.user._id, obj).
          success(function (data) {
            $scope.busy = false;
            authService.user = data;
          }).
          error(function (data) {
            $scope.busy = false;
            // TODO
            console.log(data);
          });
      };
    }
  ]);
};
