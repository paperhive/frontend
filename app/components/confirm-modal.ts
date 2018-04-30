export default function(app) {
  app.component('confirmModal', {
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '<',
    },
    template: require('./confirm-modal.html'),
  });
}
