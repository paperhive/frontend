import { compact } from 'lodash';

export const settingsEmailComponent = {
  bindings: {
    person: `<`,
    onUpdateDefaultEmail: '&',
  },
  controller: [
    '$scope', '$http', 'config', 'authService', 'notificationService',
    function($scope, $http, config, authService, notificationService) {
      const ctrl = this;

      $scope.$watch('$ctrl.person', (person) => {
        if (!person) return;

        // verified email addresses (from externalIds)
        ctrl.verifiedEmails = compact(person.externalIds.map(externalId => {
          if (externalId.type !== 'email' || !externalId.id) return;
          return {
            address: externalId.id,
            verified: true,
            default: externalId.id === person.account.email,
          };
        }));

        // email addresses that have not yet been verified
        $http.get(`${config.apiUrl}/people/${person.id}/emails/pending`)
          .then(response => {
            ctrl.pendingEmails = response.data.emails.map(email => ({
              address: email.email,
              pending: true,
            }));
          }, notificationService.httpError('Could not fetch pending email addresses.'));
      }, true);

      // add an email address
      ctrl.add = email => {
        ctrl.adding = true;
        ctrl.addSuccess = undefined;
        ctrl.addError = undefined;

        $http.post(`${config.apiUrl}/people/${ctrl.person.id}/emails`, {
          email: email,
          frontendUrl: authService.frontendUrl,
          returnUrl: authService.returnPath
        }).then(response => {
          ctrl.adding = false;
          ctrl.addSuccess = response.data;
          ctrl.pendingEmails.push({address: email, pending: true});
          ctrl.email = undefined;
        }, response => {
          ctrl.adding = false;
          ctrl.addError = response.data;
        });
      };

      // update default email in parent component
      ctrl.updateDefaultEmail = email => {
        if (ctrl.onUpdateDefaultEmail) {
          ctrl.updating = true;
          ctrl.onUpdateDefaultEmail({email}).then(
            () => { ctrl.updating = false; },
            (error) => {
              ctrl.updating = false;
              ctrl.updateDefaultEmailError = error;
            }
          );
        }
      };
    }
  ],
  template: `
  <div class="has-feedback row has-error" ng-if="!$ctrl.person.account.email">
    <span class="col-sm-10 text-danger">
      <i class="fa fa-fw fa-warning"></i>
      No email address is associated with your account. This means that we
      cannot send you discussion notifications. Please add an email address
      below.
    </span>
  </div>

  <div class="row" ng-repeat="email in $ctrl.verifiedEmails.concat($ctrl.pendingEmails) | orderBy:['verified','address']">
    <span class="col-sm-7">
      {{email.address}}
    </span>
    <span class="col-sm-5 text-right">
      <span ng-if="email.default" class="label label-default">
        Default
      </span>
      <a ng-if="!email.default && email.verified" href=""
          ng-click="$ctrl.updateDefaultEmail(email.address)">
        Set as default
      </a>
      <span ng-if="email.pending" class="label label-warning">
        Pending
      </span>
    </span>
  </div>

  <div class="ph-lg-margin-top">
    <form name="addEmailForm" novalidate>
      <label for="email">
        Add email address
      </label>
      <div class="input-group">
        <input type="email" class="form-control" ng-model="$ctrl.email"
          ng-disabled="$ctrl.adding"
          name="email" id="email" pattern=".*@.+\..+" required>
        <span class="input-group-btn">
          <button class="btn btn-primary" ng-click="addEmailForm.$valid && $ctrl.add($ctrl.email)"
              ng-disabled="$ctrl.adding || addEmailForm.$invalid">
            <i class="fa fa-plus"></i>
            Add
          </button>
        </span>
      </div>
      <p class="help-block">
        <span ng-if="$ctrl.addSuccess">
          <i class="fa fa-fw fa-check"></i>
          {{$ctrl.addSuccess.message}}
        </span>
        <span ng-if="$ctrl.addError" class="text-danger">
          <i class="fa fa-fw fa-times"></i>
          {{$ctrl.addError.message}}
        </span>
      </p>
    </form>
  </div>
  `,
};
