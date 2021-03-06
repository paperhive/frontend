export default function(app) {
  app.service('documentItemsApi', class DocumentItemsApi {
    static $inject = ['$http', 'config', 'notificationService'];
    constructor(public $http, public config, public notificationService) {}

    bookmarkAdd(documentItem, channel) {
      return this.$http
        .post(`${this.config.apiUrl}/document-items/${documentItem}/channel-bookmarks/${channel}`)
        .catch(this.notificationService.httpError('could not add bookmark'))
        .then(response => response.data);
    }

    bookmarkDelete(documentItem, channel) {
      return this.$http
        .delete(`${this.config.apiUrl}/document-items/${documentItem}/channel-bookmarks/${channel}`)
        .catch(this.notificationService.httpError('could not remove bookmark'));
    }

    delete(documentItem) {
      return this.$http.delete(`${this.config.apiUrl}/document-items/${documentItem}`)
        // TODO improve authorization error message
        .catch(this.notificationService.httpError('could not delete document item'));
    }

    get(documentItem) {
      return this.$http.get(`${this.config.apiUrl}/document-items/${documentItem}`)
        // TODO improve authorization error message
        .catch(this.notificationService.httpError('could not retrieve document item'))
        .then(response => response.data);
    }

    getByChannel(channel) {
      return this.$http.get(`${this.config.apiUrl}/document-items/by-channel/${channel}`)
        // TODO improve authorization error message
        .catch(this.notificationService.httpError('could not retrieve document items for channel'))
        .then(response => response.data);
    }

    getByRevision(revision) {
      return this.$http.get(`${this.config.apiUrl}/document-items/by-revision/${revision}`)
        // TODO improve authorization error message
        .catch(this.notificationService.httpError('could not retrieve document items for revision'))
        .then(response => response.data);
    }

    getByDocument(document) {
      return this.$http.get(`${this.config.apiUrl}/document-items/by-document/${document}`)
        // TODO improve authorization error message
        .catch(this.notificationService.httpError('could not retrieve document items for document'))
        .then(response => response.data);
    }

    getByExternalDocumentId(type, id) {
      return this.$http({
        url: `${this.config.apiUrl}/document-items/by-document/external`,
        params: {type, id},
      })
        .catch(this.notificationService.httpError('could not retrieve document items for external document id'))
        .then(response => response.data);
    }

    search(query) {
      return this.$http.get(`${this.config.apiUrl}/document-items/search`, {params: query})
        .catch(this.notificationService.httpError('could not search documents'))
        .then(response => response.data);
    }

    shareAdd(documentItem, channel) {
      return this.$http
        .post(`${this.config.apiUrl}/document-items/${documentItem}/channel-shares/${channel}`)
        .catch(this.notificationService.httpError('could not add share'))
        .then(response => response.data);
    }

    shareDelete(documentItem, channel) {
      return this.$http
        .delete(`${this.config.apiUrl}/document-items/${documentItem}/channel-shares/${channel}`)
        .catch(this.notificationService.httpError('could not remove share'));
    }

    updateMetadata(documentItem, metadata) {
      return this.$http
        .put(`${this.config.apiUrl}/document-items/${documentItem}/metadata`, metadata)
        .catch(this.notificationService.httpError('could not update metadata'))
        .then(response => response.data);
    }

    upload(file: File, options, onProgress: (o: {submittedBytes: number}) => void) {
      return this.$http.post(
        `${this.config.apiUrl}/document-items/upload`,
        file,
        {
          headers: {
            'Content-Type': file.type,
          },
          params: {
            ...options,
            filename: file.name,
          },
          uploadEventHandlers: {
            progress: e => onProgress && onProgress({submittedBytes: e.loaded}),
          },
        },
      )
        .then(response => response.data);
    }

    upsertFromRemote(type, id) {
      return this.$http
        .post(`${this.config.apiUrl}/document-items/remote`, undefined, {params: {type, id}})
        .then(response => response.data)
        .catch(this.notificationService.httpError('could not upsert from remote'));
    }
  });
}
