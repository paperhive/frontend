'use strict';
import template from './channel-new.html';

export default function(app) {
  app.component('channelNew', {
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '<',
    },
    controller: class ChannelNewCtrl {
      inProgress: boolean;
      description: string;
      name: string;
      succeeded: boolean;

      static $inject = ['$location', '$scope', 'channelService'];
      constructor(public $location, public $scope, public channelService) {}

      hasError(field) {
        const form = this.$scope.channelForm;
        return form && (form.$submitted || form[field].$touched) &&
          form[field].$invalid;
      }

      submit() {
        this.inProgress = true;
        this.succeeded = false;
        this.channelService.create({
          name: this.name,
          description: this.description,
        }).then(channel => {
          this.inProgress = false;
          this.succeeded = true;
          this.close();
          if (this.resolve.redirect) {
            this.$location.path(`/channels/${channel.id}`);
          }
        });
      }
    },

    template,
  });
};
