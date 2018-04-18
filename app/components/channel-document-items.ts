import { isDocumentItemBookmarkedInChannel, isDocumentItemSharedInChannel } from '../utils/document-items';

export default function(app) {
  app.component('channelDocumentItems', {
    bindings: {
      documentItems: '<',
      channel: '<',
    },
    controller: class ChannelDocumentItemsCtrl {
      public channel: any;

      static $inject = ['authService'];
      constructor(public authService) {}

      isBookmarkedInChannel(documentItem) {
        return isDocumentItemBookmarkedInChannel(documentItem, this.channel);
      }

      isSharedInChannel(documentItem) {
        return isDocumentItemSharedInChannel(documentItem, this.channel);
      }
    },
    template: require('./channel-document-items.html'),
  });
}
