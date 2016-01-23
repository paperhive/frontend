'use strict';
module.exports = function(app) {

  app.directive('gravatarUser', [
    'notificationService',
    function(notificationService) {
      return {
        restrict: 'A',
        scope: {
          gravatarUser: '=',
          gravatarSize: '='
        },
        link: function(scope, element, attrs) {
          if (!scope.gravatarSize) {
            notificationService.notifications.push({
              type: 'error',
              message: 'Directive needs gravatarSize.'
            });
          }
          scope.$watch(
            'gravatarUser',
            function(user) {
              if (!user || !user.user || !user.user.avatar || user.user.avatar.type !== 'gravatar') {
                return;
              }
              element.attr('width', scope.gravatarSize + 'px');
              element.attr('height', scope.gravatarSize + 'px');
              element.attr(
                'src',
                'https://secure.gravatar.com/avatar/' +
                user.user.avatar.value +
                  '?s=' + scope.gravatarSize +
                    '&d=identicon'
              );
              element.attr('alt', user.displayName + ' avatar');
            }
          );
        }
      };
    }]);
};
