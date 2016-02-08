'use strict';
export default function(app) {

  app.directive('gravatar', [
    function() {
      return {
        restrict: 'E',
        scope: {
          user: '=',
          size: '='
        },
        replace: true,
        template: '<img width={{size}} height={{size}} ng-src="https://secure.gravatar.com/avatar/{{user.user.avatar.value}}?={{size}}&d=identicon" alt="{{user.displayName}} avatar">',
      };
    }]);
};
