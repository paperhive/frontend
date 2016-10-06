import template from './document-sidenav.html';

export default function(app) {
  app.component('documentSidenav', {
    bindings: {
      revisions: '<',
      latestRevision: '<', // TODO: replace!
      open: '<',
      viewportOffsetTop: '<',
      onToggle: '&',
    },
    controller: class DocumentSidenavCtrl {},
    template,
  });
}
