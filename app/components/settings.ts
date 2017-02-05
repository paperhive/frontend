import { cloneDeep, find } from 'lodash';

export default function(app) {
  app.component('settings', {
    controller: [
      '$scope', 'authService',
      function($scope, authService) {
        $scope.tab = 'profile';
        $scope.auth = authService;

        // keep user copy up to date
        $scope.$watch('auth.user', function(user) {
          $scope.user = cloneDeep(user);
        });

        $scope.find = find;
      },
    ],
    template: require('./settings.html'),
  });
};
