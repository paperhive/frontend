export default function(app) {
  app.config(
    ['$locationProvider', function($locationProvider) {
      $locationProvider.html5Mode({
        enabled: true,
        // disable requireBase for unit tests
        // see http://stackoverflow.com/a/28686169/1219479
        requireBase: false,
      });
    }
  ]);
}
