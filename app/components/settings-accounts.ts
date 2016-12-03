export default function(app) {
  app.component('settingsAccounts', {
    bindings: {
      person: `<`,
    },
    controller: [
      '$http', 'authService', 'notificationService',
      function($http, authService, notificationService) {
        const ctrl = this;
        ctrl.auth = authService;
      },
    ],
    template: require('./settings-accounts.html'),
  });
}
