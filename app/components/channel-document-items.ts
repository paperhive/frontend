export default function(app) {
  app.component('channelDocumentItems', {
    bindings: {
      documentItems: '<',
      channel: '<',
    },
    controller: class ChannelDocumentItemsCtrl {
      static $inject = ['authService'];
      constructor(public authService) {}
    },
    template: require('./channel-document-items.html'),
  });
}
