require('./margin-cluster-pane.less');

export default function(app) {
  app.component('marginClusterPane', {
    bindings: {
      cluster: '<',
      onClose: '&',
    },
    controller: class MarginClusterPaneCtrl {},
    template: require('./margin-cluster-pane.html'),
  });
}
