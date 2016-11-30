import { get } from 'lodash';

export default function(app) {
    app.component('avatar', {
      bindings: {
        user: `<`,
        size: '@',
        classes: '@',
      },
      controller: [ '$scope',
        function($scope) {
          const ctrl = this;

          $scope.$watch('$ctrl.user', function(user) {
            if (get(user, ['account', 'avatar', 'type']) === 'gravatar') {
              ctrl.url = 'https://secure.gravatar.com/avatar/' +
                user.account.avatar.value + '?d=identicon&s=' + ctrl.size;
            } else if (get(user, ['account', 'avatar', 'type']) === 'google') {
              ctrl.url = user.account.avatar.value + '?sz=' + ctrl.size;
            } else {
              // fallback mystery man
              ctrl.url = 'https://secure.gravatar.com/avatar/?d=mm&s=' + ctrl.size;
            }
          });
        }],
      template: '<img width={{$ctrl.size}} height={{$ctrl.size}} ng-src="{{$ctrl.url}}" alt="{{$ctrl.user.displayName}} avatar" class="{{$ctrl.classes}}">',
    });
};
