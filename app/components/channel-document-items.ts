import { isDocumentItemSharedWithUser } from '../utils/document-items';

export default function(app) {
  app.component('channelDocumentItems', {
    bindings: {
      documentItems: '<',
      channel: '<',
    },
    controller: class ChannelDocumentItemsCtrl {
      static $inject = ['authService'];
      constructor(public authService) {}

      isSharedWithYou(documentItem) {
        return isDocumentItemSharedWithUser(documentItem, this.authService.user);
      }
    },
    template: require('./channel-document-items.html'),
  });
}
