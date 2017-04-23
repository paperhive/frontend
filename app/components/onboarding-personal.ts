require('./onboarding.less');

export default function(app) {
  app.component('onboardingPersonal', {
    bindings: {
      active: '<',
      onNext: '&',
    },
    controller: class OnboardingPersonalCtrl {},
    template: require('./onboarding-personal.html'),
  });
};
