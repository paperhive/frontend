export default function (app) {
  app.config(function($logProvider){
    $logProvider.debugEnabled(false);
  });
}