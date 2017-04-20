import { isArray } from 'lodash';

require('./document-sidenav-outline-item.less');

export default function(app) {
  app.component('documentSidenavOutlineItem', {
    bindings: {
      item: '<',
      onAnchorUpdate: '&',
    },
    controller: class DocumentSidenavOutlineItemCtrl {
      item: any;
      onAnchorUpdate: (o: {anchor: string}) => Promise<void>;

      collapsed = true;

      select() {
        let anchor;
        if (isArray(this.item.dest)) {
          anchor = `pdfdr:${JSON.stringify(this.item.dest)}`;
        } else {
          anchor = `pdfd:${this.item.dest}`;
        }
        console.log(anchor);
        this.onAnchorUpdate({anchor});
      }
    },
    template: require('./document-sidenav-outline-item.html'),
  });
}
