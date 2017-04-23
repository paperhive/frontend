require('./onboarding.less');

export default function(app) {
  app.component('onboarding', {
    controller: class OnboardingCtrl {
      currentStep = 1;

      next() {
        this.currentStep += 1;
      }

      previous() {
        this.currentStep -= 1;
      }
    },
    template: require('./onboarding.html'),
  });
};
