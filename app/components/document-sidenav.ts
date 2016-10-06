import template from './document-sidenav.html';

export default function(app) {
  app.component('documentSidenav', {
    bindings: {
      revisions: '<',
      open: '<',
      viewportOffsetTop: '<',
      onToggle: '&',
    },
    controller: class DocumentSidenavCtrl {},
    template,
  });
}
