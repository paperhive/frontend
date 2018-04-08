export default function(app) {
  app.component('userProfile', {
    bindings: {
      user: '<',
    },
    controller: class UserProfileCtrl {
      user: any;
      documentSubscriptions: any[];

      static $inject = ['$scope', 'documentSubscriptionsApi'];
      constructor($scope, public documentSubscriptionsApi) {
        $scope.$watch('$ctrl.user', this.updateDocumentSubscriptions.bind(this));
      }

      updateDocumentSubscriptions() {
        this.documentSubscriptions = undefined;
        if (!this.user) return;
        this.documentSubscriptionsApi.getByPerson(this.user.id)
          .then(({documentSubscriptions}) => this.documentSubscriptions = documentSubscriptions);
      }
    },
    template: require('./user-profile.html'),
  });
}
