import {cloneDeep, forEach} from 'lodash';

export default function(app) {
  app.component('settingsProfile', {
    bindings: {
      user: '<',
    },
    controller: [
      '$scope', '$http', '$uibModal', 'authService', 'config', 'notificationService',
      function($scope, $http, $uibModal, authService, config, notificationService) {
        const ctrl = this;

        ctrl.setting = {};

        ctrl.saveRaw = () => {
          const obj = cloneDeep(ctrl.user);

          // TODO revisit. whitelist?
          // remove all keys which we are not allowed to set
          const deleteKeys = ['id', 'gravatarMd5', 'firstSignin',
            'createdAt', 'updatedAt', 'externalIds'];
          forEach(deleteKeys, function(key) { delete obj[key]; });

          delete obj.account.createdAt;

          // save
          return $http.put(config.apiUrl + '/people/' + ctrl.user.id, obj);
        };

        // save to api
        ctrl.save = function() {
          ctrl.busy = 'save';

          ctrl.saveRaw().then(
            response => {
              ctrl.busy = false;
              authService.user = response.data;
              ctrl.setting.succeeded = true;
              setTimeout(function() {
                ctrl.setting.succeeded = false;
                $scope.$apply();
              }, 5000);
            },
            response => {
              ctrl.busy = false;
              notificationService.httpError('could not save data');
              ctrl.setting.succeeded = false;
            },
          );
        };

        ctrl.openDeleteAccountModal = function() {
          $uibModal.open({component: 'account-delete-modal'});
        };
    }],
    template: require('./settings-profile.html'),
  });
}
