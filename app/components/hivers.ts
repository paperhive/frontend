export default function(app) {
  app.component('hivers', {
    bindings: {
      hivers: '<',
    },
    template: require('./hivers.html'),
  });
};
