export default function(app) {
  app.component('documentItemMetadataModal', {
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '<',
    },
    controller: class DocumentItemMetadataModalCtrl {
      close: (o: {documentItem: any}) => void;
      resolve: {
        documentItem: any;
      };

      public error: string;
      public submitting = false;
      public succeeded = false;
      public metadata: any;

      static $inject = ['documentItemsApi'];
      constructor(public documentItemsApi) {
        this.metadata = {...this.resolve.documentItem.metadata};
      }

      public submit() {
        this.submitting = true;
        this.succeeded = false;
        this.documentItemsApi
          .updateMetadata(this.resolve.documentItem.id, this.metadata)
          .then(documentItem => this.close({documentItem}))
          .catch(error => this.error = error);
      }
    },
    template: require('./document-item-metadata-modal.html'),
  });
}
