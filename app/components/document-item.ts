export default function(app) {
  app.component('documentItem', {
    bindings: {
      document: '<',
    },
    template: require('./document-item.html'),
  });
};
