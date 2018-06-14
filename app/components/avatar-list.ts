import { map, uniqBy } from 'lodash';

export default function(app) {
  app.component('avatarList', {
    bindings: {
      discussion: '<',
    },
    controller: ['$scope', function($scope) {
      const $ctrl = this;
      $scope.$watchCollection('$ctrl.discussion.replies', () => {
        if (!$ctrl.discussion) return;

        $scope.participants = $ctrl.discussion.replies
          .filter(reply => !reply.deleted)
          .map(reply => reply.author);
        // prepend original annotation author
        if (!$ctrl.discussion.deleted) {
          $scope.participants.unshift($ctrl.discussion.author);
        }

        // make list unique w.r.t. id
        $scope.participants = uniqBy($scope.participants, 'id');
      });
    }],
    template:
      `<span ng-repeat="user in participants" class="ph-xs-padding">
        <a href="./users/{{user.account.username}}" class="ph-link-icon"
          title="{{user.displayName}}"
        >
          <avatar user="user" size="30" classes="img-circle"></avatar>
        </a>
      </span>`,
  });
};
