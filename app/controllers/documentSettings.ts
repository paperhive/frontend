'use strict';

export default function(app) {

  app.controller('DocumentSettingsCtrl', [
    '$scope', 'metaService',
    function($scope, metaService) {
      // set meta data
      $scope.$watch('document', function(document) {
        if (document) {
          metaService.set({
            title: 'Settings · ' + document.title + ' · PaperHive',
            meta: [
              {
                name: 'description',
                content: 'Settings for ' + document.title + ' by ' +
                  document.authors.join(', ')
              },
              {name: 'author', content: document.authors.join(', ')}
            ]
          });
        }
      });
    }
  ]);
};
