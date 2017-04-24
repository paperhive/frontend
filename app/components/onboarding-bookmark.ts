require('./onboarding.less');

export default function(app) {
  app.component('onboardingBookmark', {
    bindings: {
      active: '<',
      onNext: '&',
      onPrevious: '&',
    },
    controller: class OnboardingBookmarkCtrl {
      onNext: () => void;
      complete = false;

      next() {
        this.complete = true;
        this.onNext();
      }
    },
    template: require('./onboarding-bookmark.html'),
  });
};
