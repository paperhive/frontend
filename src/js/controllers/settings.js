'use strict';
var _ = require('lodash');

module.exports = function(app) {

  app.controller('SettingsCtrl', [
    '$scope', '$http', 'config', 'authService', 'notificationService',
    function($scope, $http, config, authService, notificationService) {
      $scope.tab = 'profile';
      $scope.auth = authService;

      // keep user copy up to date
      $scope.$watch('auth.user', function(user) {
        $scope.user = _.cloneDeep(user);
      });

      // sync from orcid
      $scope.syncFromOrcid = function() {
        $scope.busy = 'sync';

        var account = _.findLast($scope.user.externalIds, {type: 'orcid'});

        $http.put(config.apiUrl +
                  '/people/' + $scope.user.id + '/syncFromOrcid').
          success(function(data) {
            $scope.busy = false;
            authService.user = data;
          }).
          error(function(data) {
            $scope.busy = false;
            notificationService.httpError('could not sync data');
          });
      };

      // save to api
      $scope.save = function() {
        $scope.busy = 'save';

        var obj = _.cloneDeep($scope.user);

        // TODO revisit. whitelist?
        // remove all keys which we are not allowed to set
        var deleteKeys = ['id', 'gravatarMd5', 'firstSignin',
          'createdAt', 'updatedAt', 'externalIds'];
        _.forEach(deleteKeys, function(key) { delete obj[key]; });

        delete obj.user.createdAt;

        // save
        $http.put(config.apiUrl + '/people/' + $scope.user.id, obj).
          success(function(data) {
            $scope.busy = false;
            authService.user = data;
          }).
          error(function(data) {
            $scope.busy = false;
            notificationService.httpError('could not save data');
          });
      };
    }
  ]);
};
