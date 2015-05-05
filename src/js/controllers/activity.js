'use strict';

module.exports = function(app) {

  app.controller('ActivityCtrl', [
    '$scope', 'metaService',
    function($scope, metaService) {
      // set meta data
      $scope.$watch('article', function(article) {
        if (article) {
          metaService.set({
            title: 'Activity · ' + article.title + ' · PaperHive',
            meta: {
              description: 'Activity for ' + article.title + ' by ' +
                article.authors.join(', ') + '.',
              author: article.authors.join(', ')
            }
          });
        }
      });
    }
  ]);
};
