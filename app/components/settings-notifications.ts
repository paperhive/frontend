import { cloneDeep } from 'lodash';

export function createPersonUpdate(person) {
  const { displayName, discipline, occupation, account } = cloneDeep(person);
  const { createdAt, featureFlags, ...accountUpdate } = account;
  return {
    displayName,
    discipline,
    occupation,
    account: {...accountUpdate},
  };
}

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
        this.peopleApi.update(this.authService.user.id, personUpdate)
          .then(result => console.log(result))
      }
    },
    template: require('./settings-notifications.html'),
  });
}
