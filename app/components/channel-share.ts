export default function(app) {
  app.component('channelShare', {
    bindings: {
      shares: '<',
      onAddShare: '&',
      onRemoveShare: '&',
    },
    controller: class ChannelShareCtrl {
      shares: any[];
      onAddShare: (o: {$channel: string}) => Promise<void>;
      onRemoveShare: (o: {$channel: string}) => Promise<void>;

      submitting = false;

      static $inject = ['$uibModal', 'authService', 'channelService'];
      constructor(public $uibModal, public authService, public channelService) {}

      isShared(channel) {
        return !!this.shares.find(share => share.channel === channel);
      }

      share(channel) {
        this.submitting = true;
        this.onAddShare({$channel: channel}).then(() => this.submitting = false);
      }

      removeShare(channel) {
        this.submitting = true;
        this.onRemoveShare({$channel: channel}).then(() => this.submitting = false);
      }

      newChannelModalOpen() {
        this.$uibModal.open({component: 'channelNew'});
      }
    },
    template: require('./channel-share.html'),
  });
}
