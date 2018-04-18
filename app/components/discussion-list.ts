import { find } from 'lodash';

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
