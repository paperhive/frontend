export default function(app) {
  app.component('userProfile', {
    template: require('./user-profile.html'),
    bindings: {
      user: '<',
    },
  });
};
