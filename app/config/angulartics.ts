export default function(app) {
  app.config(['$analyticsProvider', function($analyticsProvider) {
    // disable analytics by default
    $analyticsProvider.api.setOptOut(true);
  }]);
}
