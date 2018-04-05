import { find } from 'lodash';

import { getRevisionMetadata } from '../utils/documents';

export default function(app) {
  app.component(
    'discussionList', {
      bindings: {
        discussions: '<',
        documentItem: '<',
      },
      controller: ['$scope', 'channelService', 'metaService',
        function(channelService) {
          this.channelService = channelService;
        },
      ],
      template: require('./discussion-list.html'),
    });
}
