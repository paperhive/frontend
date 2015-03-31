'use strict';

module.exports = function(app) {

  app.controller('ArticleSettingsCtrl', [
    '$scope', 'metaService',
    function($scope, metaService) {
      // set meta data
      $scope.$watch('article', function(article) {
        if (article) {
          metaService.title = 'Settings · ' + article.title;
          metaService.author =
            article.authors.join(', ');
          metaService.description =
            article.abstract.replace(/(\r\n|\n|\r)/gm, ' ').substring(0, 150);
          metaService.keywords = undefined;
        }
      });
    }
  ]);
};
