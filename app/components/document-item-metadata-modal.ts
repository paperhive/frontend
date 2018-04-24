require('./document-item-metadata-modal.less');

import { cloneDeep } from 'lodash';

export default function(app) {
  app.component('documentItemMetadataModal', {
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '<',
    },
    controller: class DocumentItemMetadataModalCtrl {
      close: (o: {$value: any}) => void;
      resolve: {
        documentItem: any;
      };

      public error: string;
      public submitting = false;
      public succeeded = false;
      public metadata: any;

      author: string;

      static $inject = ['$scope', 'documentItemsApi'];
      constructor(public $scope, public documentItemsApi) {
        this.metadata = cloneDeep(this.resolve.documentItem.metadata);
        if (!this.metadata.authors) this.metadata.authors = [];
      }

      public addAuthor() {
        if (!this.author) return;
        this.metadata.authors.push({name: this.author});
        delete this.author;
      }

      public hasError(field) {
        const form = this.$scope.metadataForm;
        return form && (form.$submitted || form[field].$touched) &&
          form[field].$invalid;
      }

      public isSubmitDisabled() {
        return this.submitting
          || this.succeeded
          || this.$scope.metadataForm.$invalid
          || this.metadata.authors.length === 0;
      }

      public submit() {
        this.submitting = true;
        this.succeeded = false;
        this.documentItemsApi
          .updateMetadata(this.resolve.documentItem.id, this.metadata)
          .then(documentItem => {
            this.succeeded = true;
            return this.close({$value: {documentItem}});
          })
          .catch(error => this.error = error)
          .finally(() => this.submitting = false);
      }
    },
    template: require('./document-item-metadata-modal.html'),
  });
}
