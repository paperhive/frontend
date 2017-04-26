require('./onboarding.less');

export default function(app) {
  app.component('onboarding', {
    controller: class OnboardingCtrl {
      currentStep = 1;
      channelId: string;

      static $inject = ['$location', 'scroll'];
      constructor(public $location, public scroll) {}

      next() {
        if (this.currentStep === 3) {
          this.$location.url(`/channels/${this.channelId}`);
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
