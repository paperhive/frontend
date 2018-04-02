export default function(app) {
  app.service('documentSubscriptionsApi', class DocumentSubscriptionsApi {
    static $inject = ['$http', 'config', 'notificationService'];
    constructor(public $http, public config, public notificationService) {}

    getByDocument(documentId) {
      return this.$http
        .get(`${this.config.apiUrl}/document-subscriptions/by-document/${documentId}`)
        .catch(this.notificationService.httpError('could not get document subscriptions'))
        .then(response => response.data);
    }

    getByPerson(personId) {
      return this.$http
        .get(`${this.config.apiUrl}/document-subscriptions/by-person/${personId}`)
        .catch(this.notificationService.httpError('could not get document subscriptions'))
        .then(response => response.data);
    }

    add(documentId) {
      return this.$http
        .post(`${this.config.apiUrl}/document-subscriptions/${documentId}`)
        .catch(this.notificationService.httpError('could not add subscription'))
        .then(response => response.data);
    }

    remove(documentId) {
      return this.$http
        .delete(`${this.config.apiUrl}/document-subscriptions/${documentId}`)
        .catch(this.notificationService.httpError('could not remove subscription'))
        .then(response => response.data);
    }
  });
}
