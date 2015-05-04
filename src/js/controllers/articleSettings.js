'use strict';

module.exports = function(app) {

  app.controller('ArticleSettingsCtrl', [
    '$scope', 'metaService',
    function($scope, metaService) {
      // set meta data
      $scope.$watch('article', function(article) {
        if (article) {
          metaService.set({
            title: 'Settings · ' + article.title + ' · PaperHive',
            author: article.authors.join(', '),
            description:
              article.abstract.replace(/(\r\n|\n|\r)/gm, ' ').substring(0, 150)
          });
        }
      });
    }
  ]);
};
