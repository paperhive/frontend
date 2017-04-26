export default function(app) {
  app.service('documentsApi', class DocumentsApi {
    static $inject = ['$http', 'config', 'notificationService'];
    constructor(public $http, public config, public notificationService) {}

    bookmarksGet(documentId) {
      return this.$http.get(`${this.config.apiUrl}/documents/${documentId}/bookmarks`)
        .catch(this.notificationService.httpError('could not get document bookmarks'))
        .then(response => response.data);
    }

    bookmarkAdd(documentId, channelId) {
      return this.$http.post(
        `${this.config.apiUrl}/documents/${documentId}/bookmarks`,
        undefined,
        {params: {channel: channelId}},
      )
        .catch(this.notificationService.httpError('could not add bookmark'))
        .then(response => response.data);
    }

    bookmarkDelete(documentId, channelId) {
      return this.$http.delete(
        `${this.config.apiUrl}/documents/${documentId}/bookmarks`,
        {params: {channel: channelId}},
      )
        .catch(this.notificationService.httpError('could not remove bookmark'))
        .then(response => response.data);
    }

    search(query) {
      return this.$http.get(`${this.config.apiUrl}/documents/search`, {params: query})
        .catch(this.notificationService.httpError('could not search documents'))
        .then(response => response.data);
    }

    searchScroll(scrollToken) {
      return this.$http.get(`${this.config.apiUrl}/documents/search/scroll`, {params: {scrollToken}})
        .catch(this.notificationService.httpError('could not scroll documents'))
        .then(response => response.data);
    }
  });
}
