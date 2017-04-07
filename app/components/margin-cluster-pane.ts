require('./margin-cluster-pane.less');

export default function(app) {
  app.component('marginClusterPane', {
    bindings: {
      cluster: '<',
      onClose: '&',
      onDiscussionSubmit: '&',
      onDiscussionUpdate: '&',
      onDiscussionDelete: '&',
      onReplySubmit: '&',
      onReplyUpdate: '&',
      onReplyDelete: '&',
      onDiscussionHover: '&',
    },
    controller: class MarginClusterPaneCtrl {},
    template: require('./margin-cluster-pane.html'),
  });
}
