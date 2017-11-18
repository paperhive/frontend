export default function(app) {
  app.component('navbarUser', {
    controller: class NavbarUserCtrl {
      static $inject = ['authService'];
      constructor(public authService) {}
    },
    template: require('./navbar-user.html'),
  });
}
