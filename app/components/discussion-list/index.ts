'use strict';

import template from './template.html!text';

export default function(app) {
  app.component(
    'discussionList', {
      template,
      bindings: {
        discussions: '<',
      },
      controller: [
        '$scope', 'metaService',
        function($scope, metaService) {
          $scope.$watch('$ctrl.discussions', function(discussions) {
            $scope.discussions = discussions;
          });

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
      ]
    });
};
