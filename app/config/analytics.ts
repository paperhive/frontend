export default function(app) {
  app.config(['$analyticsProvider', function($analyticsProvider) {
    // disable analytics by default
    $analyticsProvider.api.setOptOut(true);

    // don't track first page view (we do so manually when the user opted in)
    $analyticsProvider.firstPageview(false);
  }]);
}
