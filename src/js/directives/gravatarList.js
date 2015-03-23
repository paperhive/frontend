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
        scope.$watch(
          'discussion',
          function(discussion) {
            if (discussion !== undefined) {

              scope.participants = _.pluck(scope.discussion.replies, 'author');
              // prepend original annotation author
              scope.participants.unshift(
                scope.discussion.originalAnnotation.author
              );

              // make list unique w.r.t. _id
              scope.participants = _.uniq(scope.participants, '_id');
            }
          },
          // http://stackoverflow.com/a/19455564/353337
          true
        );
      }
    };
  });
};
