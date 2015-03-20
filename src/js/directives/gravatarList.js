'use strict';
var _ = require('lodash');
module.exports = function(app) {

  app.directive('gravatarList', function() {
    return {
      restrict: 'E',
      scope: {
        discussion: '=',
      },
      templateUrl: 'templates/directives/gravatarList.html',
      link: function(scope, element, attrs) {
        scope.$watch('discussion', function(discussion) {
          // TODO $watch doesn't fire on reply update
          if (discussion !== undefined) {

            scope.participants = _.map(
              scope.discussion.replies,
              function(reply) {return reply.author;}
            );
            // prepend original annotation author
            scope.participants.unshift(
              scope.discussion.originalAnnotation.author
            );

            // make list unique
            scope.participants = _.uniq(
              scope.participants,
              function(user) {return user._id;}
            );
          }
        });
      }
    };
  });
};
