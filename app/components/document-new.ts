export default function(app) {
  app.component('documentNew', {
    controller: class DocumentNewCtrl {
      type: string;

      error: string;
      submitting: boolean;
      static $inject = ['$http', '$location', 'config'];
      constructor(public $http, public $location, public config) {
        this.type = 'url';
      }

      submit(type, id) {
        this.submitting = true;
        this.error = undefined;
        this.$http.post(`${this.config.apiUrl}/documents/remote`, undefined, {
          params: {type, id},
        }).then(
          response => {
            this.submitting = false;
            this.$location.path(`/documents/${response.data.id}`);
          },
          response => {
            this.submitting = false;
            this.error = response.data && response.data.message ||
              'unknown reason';
          },
        );
      }
    },
    template: require('./document-new.html'),
  });
};
