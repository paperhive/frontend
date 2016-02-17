import { map, uniqBy } from 'lodash';

export default function(app) {

  app.directive('avatarList', function() {
    return {
      restrict: 'E',
      scope: {
        discussion: '='
      },
      templateUrl: 'html/directives/avatarList.html',
      link: function(scope, element, attrs) {
        scope.$watch(
          'discussion',
          function(discussion) {
            if (discussion !== undefined) {

              scope.participants = map(scope.discussion.replies, 'author');
              // prepend original annotation author
              scope.participants.unshift(
                scope.discussion.author
              );

              // make list unique w.r.t. id
              scope.participants = uniqBy(scope.participants, 'id');
            }
          },
          // http://stackoverflow.com/a/19455564/353337
          true
        );
      }
    };
  });
};
