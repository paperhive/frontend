require('./margin-cluster.less');

export default function(app) {
  app.component('marginCluster', {
    bindings: {
      cluster: '<',
      onOpen: '&',
    },
    controller: class MarginClusterCtrl {},
    template: require('./margin-cluster.html'),
  });
}
