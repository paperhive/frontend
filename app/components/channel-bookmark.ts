export default function(app) {
  app.component('channelBookmark', {
    bindings: {
      documentCtrl: '<',
    },
    controller: class channelBookmarkCtrl {
      submitting = false;

      static $inject = ['$uibModal', 'authService', 'channelService'];
      constructor(public $uibModal, public authService, public channelService) {}

      bookmark(channel) {
        this.submitting = true;
        this.documentCtrl.bookmark(channel).then(() => this.submitting = false);
      }

      removeBookmark(channel) {
        this.submitting = true;
        this.documentCtrl.removeBookmark(channel).then(() => this.submitting = false);
      }

      newChannelModalOpen() {
        this.$uibModal.open({component: 'channelNew'});
      };
    },
    template: require('./channel-bookmark.html'),
  });
};
