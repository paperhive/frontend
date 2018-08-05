import { cloneDeep } from 'lodash';

import { createPersonUpdate } from '../utils/people';

export default function(app) {
  app.component('settingsNotifications', {
    bindings: {
      person: '<',
    },
    controller: class SettingsNotificationsCtrl {
      public emailNotificationFrequency: 'immediately' | 'daily' | 'weekly' | 'never';
      public saving = false;

      static $inject = ['$scope', 'authService', 'peopleApi'];
      constructor($scope, public authService, public peopleApi) {
        $scope.$watch(
          '$ctrl.authService.user.account.settings.emailNotificationFrequency',
          frequency => this.emailNotificationFrequency = frequency,
        );
      }

      public save() {
        const personUpdate = createPersonUpdate(this.authService.user);
        personUpdate.account.settings = {
          ...personUpdate.account.setting,
          emailNotificationFrequency: this.emailNotificationFrequency,
        };
        this.saving = true;
        this.peopleApi.update(this.authService.user.id, personUpdate)
          .then(person => this.authService.user = person)
          .finally(() => this.saving = false);
      }
    },
    template: require('./settings-notifications.html'),
  });
}
