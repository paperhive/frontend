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

      name: string;
      email: string;
      emails: string[] = [];

      complete = false;
      submitting = false;

      static $inject = ['channelService'];
      constructor(public channelService) {}

      add(email) {
        const sanitizedEmail = OnboardingChannelCtrl.sanitizeEmail(email);
        if (this.emails.indexOf(sanitizedEmail) !== -1) return;
        this.emails.push(sanitizedEmail);
        this.email = undefined;
      }

      remove(email) {
        const index = this.emails.indexOf(OnboardingChannelCtrl.sanitizeEmail(email));
        if (index === -1) return;
        this.emails.splice(index, 1);
      }

      static sanitizeEmail(email: string) {
        return email.toLowerCase().trim();
      }

      next() {
        this.submitting = true;
        this.channelService.create({name: this.name})
          .then(channel => {
            return Promise.all(this.emails.map(email => {
              return this.channelService.invitationCreate(channel.id, {
                email,
                roles: ['member'],
              });
            }));
          })
          .then(() => {
            this.complete = true;
            this.onNext();
          })
          .finally(() => this.submitting = false);
      }
    },
    template: require('./onboarding-channel.html'),
  });
};
