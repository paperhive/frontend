export default function(app) {
  app.service('peopleApi', class PeopleApi {
    static $inject = ['$http', 'config', 'notificationService'];
    constructor(public $http, public config, public notificationService) {}

    get(personId) {
      return this.$http.get(`${this.config.apiUrl}/people/${personId}`)
        .then(
          response => response.data,
          this.notificationService.httpError('could not get person'),
        );
    }

    deleteAccount(personId, options) {
      return this.$http.delete(
        `${this.config.apiUrl}/people/${personId}/account`,
        {params: options},
      )
        .then(
          response => response.data,
          this.notificationService.httpError('could not delete account'),
        );
    }

    getByUsername(username) {
      return this.$http.get(`${this.config.apiUrl}/people/username/${username}`)
        .then(
          response => response.data,
          this.notificationService.httpError('could not get person'),
        );
    }

    emailAdd(personId, email, setAsDefault, frontendUrl, returnUrl) {
      return this.$http.post(
        `${this.config.apiUrl}/people/${personId}/emails`,
        {email, setAsDefault, frontendUrl, returnUrl},
      )
        .then(
          response => response.data,
          this.notificationService.httpError('could not add email'),
        );
    }

    emailGetPending(personId) {
      return this.$http.get(`${this.config.apiUrl}/people/${personId}/emails/pending`)
        .then(
          response => response.data,
          this.notificationService.httpError('could not get pending emails'),
        );
    }

    update(personId, person) {
      return this.$http.put(`${this.config.apiUrl}/people/${personId}`, person)
        .then(
          response => response.data,
          this.notificationService.httpError('could not update person'),
        );
    }
  });
}
