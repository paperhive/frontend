export default function(app) {
  app.component('channelBookmark', {
    bindings: {
      bookmarks: '<',
      onAddBookmark: '&',
      onRemoveBookmark: '&',
    },
    controller: class ChannelBookmarkCtrl {
      bookmarks: any[];
      onAddBookmark: (o: {$channel: string}) => Promise<void>;
      onRemoveBookmark: (o: {$channel: string}) => Promise<void>;

      submitting = false;

      static $inject = ['$uibModal', 'authService', 'channelService'];
      constructor(public $uibModal, public authService, public channelService) {}

      isBookmarked(channel) {
        return !!this.bookmarks.find(bookmark => bookmark.channel === channel);
      }

      bookmark(channel) {
        this.submitting = true;
        this.onAddBookmark({$channel: channel}).then(() => this.submitting = false);
      }

      removeBookmark(channel) {
        this.submitting = true;
        this.onRemoveBookmark({$channel: channel}).then(() => this.submitting = false);
      }

      newChannelModalOpen() {
        this.$uibModal.open({component: 'channelNew'});
      };
    },
    template: require('./channel-bookmark.html'),
  });
};
