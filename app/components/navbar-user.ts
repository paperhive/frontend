export default function(app) {
  app.component('navbarUser', {
    controller: class NavbarUserCtrl {
      static $inject = ['authService', 'documentUploadModalService'];
      constructor(public authService, public documentUploadModalService) {}
    },
    template: require('./navbar-user.html'),
  });
}
