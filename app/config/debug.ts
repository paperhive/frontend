export default function(app) {
  app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
    // TODO: add when angular >= 1.5.9 is used
    // $compileProvider.commentDirectivesEnabled(false);
    // $compileProvider.cssClassDirectivesEnabled(false);
  }]);
}
