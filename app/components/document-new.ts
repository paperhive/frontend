export default function(app) {
  app.component('documentNew', {
    controller: class DocumentNewCtrl {
      type: string;

      error: string;
      submitting: boolean;
      static $inject = ['$http', '$location', 'documentItemsApi'];
      constructor(public $http, public $location, public documentItemsApi) {
        this.type = $location.search().type || 'crossref';
      }

      submit(type, id) {
        this.submitting = true;
        this.error = undefined;
        this.documentItemsApi.upsertFromRemote(type, id)
          .then(({documentItems}) => {
            this.submitting = false;
            this.$location.path(`/documents/items/${documentItems[0].id}`);
          })
          .finally(() => this.submitting = false);
      }
    },
    template: require('./document-new.html'),
  });
}
