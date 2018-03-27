export default function(app) {
  app.component('documentItemListElement', {
    bindings: {
      document: '<',
    },
    template: require('./document-item-list-element.html'),
  });
};
