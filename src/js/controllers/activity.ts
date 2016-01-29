'use strict';

export default function(app) {

  app.controller('ActivityCtrl', [
    '$scope', 'metaService',
    function($scope, metaService) {
      // set meta data
      $scope.$watch('article', function(article) {
        if (article) {
          metaService.set({
            title: 'Activity · ' + article.title + ' · PaperHive',
            meta: [
              {
                name: 'description',
                content: 'Activity for ' + article.title + ' by ' +
                  article.authors.join(', ') + '.'
              },
              {name: 'author', content: article.authors.join(', ')}
            ]
          });
        }
      });
    }
  ]);
};
