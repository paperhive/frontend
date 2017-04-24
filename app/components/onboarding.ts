require('./onboarding.less');

export default function(app) {
  app.component('onboarding', {
    controller: class OnboardingCtrl {
      currentStep = 1;

      static $inject = ['scroll'];
      constructor(public scroll) {}

      next() {
        this.currentStep += 1;
        this.scrollToCurrentStep();
      }

      previous() {
        this.currentStep -= 1;
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
