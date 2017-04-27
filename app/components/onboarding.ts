require('./onboarding.less');

export default function(app) {
  app.component('onboarding', {
    controller: class OnboardingCtrl {
      currentStep = 1;

      static $inject = ['$location', 'authService', 'scroll'];
      constructor(public $location, public authService, public scroll) {}

      next() {
        if (this.currentStep === 3) {
          const returnUrl = this.$location.search().returnUrl;
          if (/^\/documents/.test(returnUrl)) {
            this.$location.url(returnUrl);
          } else {
            const channelId = this.authService.user.account.onboarding.channel.channel;
            if (!channelId) throw new Error('no channel available');
            this.$location.url(`/channels/${channelId}`);
          }
          return;
        }
        this.currentStep += 1;
        this.scrollToCurrentStep();
      }

      scrollToCurrentStep() {
        const stepElements = [
          'onboarding-personal',
          'onboarding-channel',
          'onboarding-bookmark',
        ];
        this.scroll.scrollTo(stepElements[this.currentStep - 1], {offset: 30});
      }
    },
    template: require('./onboarding.html'),
  });
};
