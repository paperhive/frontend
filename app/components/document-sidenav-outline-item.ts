require('./document-sidenav-outline-item.less');

export default function(app) {
  app.component('documentSidenavOutlineItem', {
    bindings: {
      item: '<',
      onSelect: '&',
    },
    controller: class DocumentSidenavOutlineItemCtrl {
      collapsed = true;
    },
    template: require('./document-sidenav-outline-item.html'),
  });
}
