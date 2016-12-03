export default function(app) {
  app.component('passwordRequest', {
    controller: ['$location', 'authService', function ($location, authService) {
      const ctrl = this;

      // get email/username from query string
      ctrl.emailOrUsername = $location.search().emailOrUsername;

      // send email/username for password reset
      ctrl.send = (emailOrUsername) => {
        ctrl.sending = true;
        ctrl.success = undefined;
        ctrl.error = undefined;
        authService.passwordRequest(emailOrUsername)
          .then(
            response => {
              ctrl.sending = false;
              ctrl.success = response.data;
            },
            response => {
              ctrl.sending = false;
              ctrl.error = response.data;
            },
          );
      };
    }],
    template: `
    <div class="container ph-xl-margin-bottom">
      <h2 class="text-center">Reset your password</h2>

      <h4 class="ph-heading-light ph-md-margin-bottom text-center">
        Enter your email address and we will send you a link to reset your password.
      </h4>

      <div class="row ph-md-padding-top">
        <div class="col-md-offset-4 col-md-4">
          <form name="passwordRequestForm" novalidate>
            <label for="emailOrUsername">Email or username</label>
            <input type="text" class="form-control" id="emailOrUsername" name="emailOrUsername"
              ng-model="$ctrl.emailOrUsername" placeholder="Enter your email address or username"
              ng-disabled="$ctrl.sending || $ctrl.success"
              required>
            <p class="help-block">
              <span ng-if="(passwordRequestForm.$submitted ||
                            passwordRequestForm.emailOrUsername.$touched)
                           && passwordRequestForm.emailOrUsername.$error.required"
                class="text-danger"
              >
                Please enter your email address or username.
              </span>
            </p>

            <button class="btn btn-primary btn-block ph-md-margin-top" type="submit"
              ng-click="!$ctrl.sending && !$ctrl.success &&
                        !passwordRequestForm.$invalid &&
                        $ctrl.send($ctrl.emailOrUsername)"
              ng-class="{disabled: $ctrl.sending || $ctrl.success || passwordRequestForm.$invalid}"
            >
              <i ng-if="$ctrl.sending" class="fa fa-fw fa-spinner fa-spin"></i>
              <i ng-if="!$ctrl.sending" class="fa fa-fw"></i>
              Send password reset email
            </button>
            <p class="help-block">
              <ul class="fa-ul text-success" ng-if="$ctrl.success">
                <li><i class="fa fa-li fa-check"></i> {{$ctrl.success.message}}</li>
              </ul>
              <ul class="fa-ul text-danger" ng-if="$ctrl.error">
                <li><i class="fa fa-li fa-times"></i> {{$ctrl.error.message}}</li>
              </ul>
            </p>
          </form>
        </div>
      </div>
    </div>
    `,
  });
}
