export default function(app) {
  app.component('navbarUser', {
    controller: class NavbarUserCtrl {
      static $inject = ['authService', 'documentUploadModalService', 'featureFlagsService'];
      constructor(public authService, public documentUploadModalService, public featureFlagsService) {}
    },
    template: require('./navbar-user.html'),
  });
}
