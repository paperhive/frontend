import { compact } from 'lodash';

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
      }
    ],
    template: `
    <p ng-if="($ctrl.person.externalIds | filter:{type: '!email'}).length === 0"
      class="text-muted"
    >
      No external accounts are currently associated with your PaperHive account.
    </p>
    <table class="table" ng-if="($ctrl.person.externalIds | filter:{type: '!email'}).length > 0">
      <thead>
        <tr>
          <th>Account</th>
          <th class="text-right">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr ng-repeat="account in $ctrl.person.externalIds | filter:{type: '!email'}">
          <td ng-switch="account.type">
            <span ng-switch-when="google">
              <img class="ph-login-icon" src="./static/img/google.svg">
              <a ng-href="https://plus.google.com/{{account.id}}" target="_blank">
                Google profile
              </a>
            </span>
            <span ng-switch-when="orcid">
              <img class="ph-login-icon" src="./static/img/orcid.svg">
              <a ng-href="http://orcid.org/{{account.id}}" target="_blank">
                ORCID account
              </a>
            </span>
          </td>
          <td class="text-success text-right">
            connected
          </td>
        </tr>
      </tbody>
    </table>

    <p>
      <a href="" ng-click="$ctrl.auth.oauthInitiate('google')"
          class="btn btn-primary btn-block">
        <img class="ph-login-icon" src="./static/img/google.svg">
        Connect your Google account
      </a>
    <p>

    <p class="text-muted">
      <a href="" ng-click="$ctrl.auth.oauthInitiate('orcid')"
          class="btn btn-primary btn-block ph-sm-margin-bottom">
        <img class="ph-login-icon" src="./static/img/orcid.svg">
        Connect your ORCID account
      </a>
      <span class="ph-text-smaller">
        <a href="http://orcid.org/" target="_blank">ORCID</a> provides a
        persistent digital identifier that distinguishes you
        from every other researcher and ensures that your work is recognized
        and linked to you.
      </span>
    </p>
    `,
  });
}
