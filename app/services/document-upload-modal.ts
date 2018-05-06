import { IModule } from 'angular';

export default function(app: IModule) {
  app.service('documentUploadModalService', class DocumentUploadModalService {
    static $inject = ['$location', '$routeSegment', '$uibModal'];
    constructor(public $location, public $routeSegment, public $uibModal) {}

    open({document, revision, metadata}) {
      return this.$uibModal
        .open({
          backdrop: 'static',
          component: 'document-upload-modal',
          resolve: {
            document: () => document,
            revision: () => revision,
            metadata: () => metadata,
          },
        })
        .result
        .then(({documentItem}) => {
          const url = this.$routeSegment.getSegmentUrl('documentItem', {documentItem: documentItem.id});
          this.$location.url(url);
        })
        .catch(() => { /* ignore closing the modal */ });
    }
  });
}
