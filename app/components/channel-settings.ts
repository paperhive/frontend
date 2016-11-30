export default function(app) {
  app.component('channelSettings', {
    bindings: {
      channel: '<',
      isOwner: '<',
    },
    controller: class ChannelSettings {
      activating = false;
      deactivating = false;
      description: string;
      inProgress = false;
      name: string;

      static $inject = ['$scope', 'channelService'];
      constructor(public $scope, public channelService) {}

      hasError(field) {
        const form = this.$scope.updateChannelForm;
        return form && (form.$submitted || form[field].$touched) &&
          form[field].$invalid;
      }

      $onChanges() {
        if (!this.channel) return;
        this.name = this.channel.name;
        this.description = this.channel.description;
      }

      channelUpdate() {
        this.inProgress = true;
        const channel = {name: this.name, description: this.description};
        this.channelService.update(this.channel.id, channel)
          .then(() => {
            this.inProgress = false;
          });
      }

      channelActivate() {
        this.activating = true;
        this.channelService.activate(this.channel.id)
          .then(() => this.activating = false);
      }

      channelDeactivate() {
        this.deactivating = true;
        this.channelService.deactivate(this.channel.id)
          .then(() => this.deactivating = false);
      }
    },
    template: require('./channel-settings.html'),
  });
}
