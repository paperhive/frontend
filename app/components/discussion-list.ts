import { find } from 'lodash';

import { getRevisionMetadata } from '../utils/documents';

export default function(app) {
  app.component(
    'discussionList', {
      bindings: {
        discussions: '<',
        documentRevision: '<',
      },
      controller: ['$scope', 'channelService', 'metaService',
        function($scope, channelService, metaService) {

          this.channelService = channelService;

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
        }
      ],
      template: require('./discussion-list.html'),
    });
};
