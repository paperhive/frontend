export default function(app) {
  app.component('analyticsConsent', {
    controller: class AnalyticsConsentCtrl {
      static $inject = ['analyticsService'];
      constructor(public analyticsService) {}

      agree() {
        this.analyticsService.enable();
      }
    },
    template: require('./analytics-consent.html'),
  });
}
