import { getDescription } from '../utils/document-items';

export default function(app) {
  app.component('documentItemsDropdown', {
    bindings: {
      documentItem: '<',
      documentItems: '<',
    },
    controller: class DocumentItemsDropdownCtrl {
      static $inject = ['authService'];
      constructor(public authService) {}

      getDescription(documentItem) {
        return getDescription(documentItem);
      }
    },
    template: require('./document-items-dropdown.html'),
  });
}
