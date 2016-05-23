import { map, uniqBy } from 'lodash';

export default function(app) {
  app.component('avatarList', {
      bindings: {
        discussion: '<'
      },
      controller: ['$scope', function($scope) {
        $scope.$watch('$ctrl.discussion', function(discussion) {
            if (!discussion) { return; }

            $scope.participants = map(discussion.replies, 'author');
            // prepend original annotation author
            $scope.participants.unshift(discussion.author);

            // make list unique w.r.t. id
            $scope.participants = uniqBy($scope.participants, 'id');
          },
          // http://stackoverflow.com/a/19455564/353337
          true
        );
      }],
      template:
        `<span ng-repeat="user in participants" class="ph-xs-padding">
          <a href="./users/{{user.account.username}}" class="ph-link-icon">
            <avatar user="user" size="30" classes="img-circle"></avatar>
          </a>
        </span>`
  });
};
