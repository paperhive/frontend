require('./onboarding.less');

export default function(app) {
  app.component('onboardingBookmark', {
    bindings: {
      active: '<',
      onNext: '&',
      onPrevious: '&',
    },
    controller: class OnboardingBookmarkCtrl {},
    template: require('./onboarding-bookmark.html'),
  });
};
