export default function(app) {
  app.config(['$animateProvider', function($animateProvider) {
    // filter font awesome animated icons
    // http://stackoverflow.com/a/24633065/1219479
    $animateProvider.classNameFilter(/^((?!(fa-spin)).)*$/);
  }]);
}
