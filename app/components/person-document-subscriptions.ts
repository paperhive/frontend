export default function(app) {
  app.component('personDocumentSubscriptions', {
    bindings: {
      documentSubscriptions: '<',
    },
    controller: class ChannelDocumentItemsCtrl {
      static $inject = ['authService'];
      constructor(public authService) {}
    },
    template: require('./person-document-subscriptions.html'),
  });
}
