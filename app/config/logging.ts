export default function (app) {
  app.config(['$logProvider', function($logProvider){
    $logProvider.debugEnabled(false);
  }]);
}
