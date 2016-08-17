'use strict';
import { find } from 'lodash';

import template from './discussion-list.html';
import { getRevisionMetadata } from '../utils/documents';

export default function(app) {
  app.component(
    'discussionList', {
      template,
      bindings: {
        documentRevision: '<',
        discussions: '<',
      },
      controller: ['$scope', 'metaService', function($scope, metaService) {
        // set meta data
        $scope.$watch('$ctrl.documentRevision', revision => {
          if (revision) {
            const metadata = getRevisionMetadata(revision);
            const description = find(metadata, {name: 'description'});

            description.content =
              `Discussions overview for ${revision.title} by ${revision.authors.join(', ')}`;

            metaService.set({
              title: 'Discussions · ' + document.title + ' · PaperHive',
              meta: metadata
            });
          }
        });
      }]
    });
};
