'use strict';
import template from './channel-new.html';

export default function(app) {
  app.component('channelNew', {
    controller: class ChannelNewCtrl {
      error: string;
      submitting: boolean;
      static $inject = ['$http', '$location', 'config'];
      constructor(public $http, public $location, public config) {
      }

      submit() {
        this.submitting = true;
        this.error = undefined;
        this.$http.post(`${this.config.apiUrl}/channels`, {
          name: this.name,
          description: this.description,
        }).then(
          response => {
            this.submitting = false;
            this.$location.path(`/channels/${response.data.id}`);
          },
          response => {
            this.submitting = false;
            this.error = response.data && response.data.message ||
              'unknown reason';
          }
        );
      }
    },
    template,
  });
};
