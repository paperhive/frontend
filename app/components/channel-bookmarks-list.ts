export default function(app) {
  app.component('channelBookmarksList', {
    bindings: {
      bookmarks: '<',
      channel: '<',
    },
    template: require('./channel-bookmarks-list.html'),
  });
}
