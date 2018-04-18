export default function(app) {
    app.component('documentSubscriptionButton', {
      bindings: {
        subscriptions: '<',
        large: '<',
        onAddSubscription: '&',
        onRemoveSubscription: '&',
      },
      controller: class DocumentSubscriptionButtonCtrl {
        subscriptions: any[];
        large: boolean;
        onAddSubscription: () => Promise<void>;
        onRemoveSubscription: () => Promise<void>;

        subscription: any;
        submitting = false;

        static $inject = ['$scope', 'authService'];
        constructor(public $scope, public authService) {
          $scope.$watchCollection('$ctrl.subscriptions', this.updateIsSubscribed.bind(this));
          $scope.$watch('$ctrl.authService.user', this.updateIsSubscribed.bind(this));
        }

        updateIsSubscribed() {
          this.subscription = this.authService.user
            && this.subscriptions
            && this.subscriptions.find(subscription => subscription.person === this.authService.user.id);
        }

        addSubscription() {
          this.submitting = true;
          this.onAddSubscription().then(() => this.submitting = false);
        }

        removeSubscription() {
          this.submitting = true;
          this.onRemoveSubscription().then(() => this.submitting = false);
        }
      },
      template: require('./document-subscription-button.html'),
    });
}
