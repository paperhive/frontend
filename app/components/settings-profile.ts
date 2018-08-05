import {cloneDeep, forEach} from 'lodash';
import { createPersonUpdate } from '../utils/people';

export default function(app) {
  app.component('settingsProfile', {
    bindings: {
      user: '<',
    },
    controller: [
      '$scope', '$http', 'authService', 'config', 'notificationService',
      function($scope, $http, authService, config, notificationService) {
        const ctrl = this;

        ctrl.setting = {};

        ctrl.saveRaw = () => {
          return $http.put(config.apiUrl + '/people/' + ctrl.user.id, createPersonUpdate(ctrl.user));
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
    }],
    template: require('./settings-profile.html'),
  });
}
