'use strict';

export default function(app) {

  app.controller('DiscussionListCtrl', [
    '$scope', 'metaService',
    function($scope, metaService) {
      // set meta data
      $scope.$watch('document', function(document) {
        if (document) {
          const meta = [{
            name: 'description',
            content: 'Discussions overview for ' + document.title +
              ' by ' + document.authors.join(', ')
          }];

          $scope.addDocumentMetaData(meta);

          metaService.set({
            title: 'Discussions · ' + document.title + ' · PaperHive',
            meta: meta
          });
        }
      });
    }
  ]);
};
