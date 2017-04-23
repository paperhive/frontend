require('./onboarding.less');

export default function(app) {
  app.component('onboardingChannel', {
    bindings: {
      active: '<',
      onNext: '&',
      onPrevious: '&',
    },
    controller: class OnboardingChannelCtrl {},
    template: require('./onboarding-channel.html'),
  });
};
