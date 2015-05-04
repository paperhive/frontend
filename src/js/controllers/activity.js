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
            author: article.authors.join(', '),
            description:
              article.abstract.replace(/(\r\n|\n|\r)/gm, ' ').substring(0, 150)
          });
        }
      });
    }
  ]);
};
