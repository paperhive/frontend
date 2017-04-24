require('./onboarding.less');

export default function(app) {
  app.component('onboardingChannel', {
    bindings: {
      active: '<',
      onNext: '&',
      onPrevious: '&',
    },
    controller: class OnboardingChannelCtrl {
      onNext: () => void;
      complete = false;

      next() {
        this.complete = true;
        this.onNext();
      }
    },
    template: require('./onboarding-channel.html'),
  });
};
