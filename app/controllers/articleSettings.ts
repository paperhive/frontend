'use strict';

export default function(app) {

  app.controller('ArticleSettingsCtrl', [
    '$scope', 'metaService',
    function($scope, metaService) {
      // set meta data
      $scope.$watch('article', function(article) {
        if (article) {
          metaService.set({
            title: 'Settings · ' + article.title + ' · PaperHive',
            meta: [
              {
                name: 'description',
                content: 'Settings for ' + article.title + ' by ' +
                  article.authors.join(', ')
              },
              {name: 'author', content: article.authors.join(', ')}
            ]
          });
        }
      });
    }
  ]);
};
