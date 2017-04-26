require('./onboarding.less');
require('./onboarding-channel.less');

export default function(app) {
  app.component('onboardingChannel', {
    bindings: {
      active: '<',
      onNext: '&',
    },
    controller: class OnboardingChannelCtrl {
      onNext: (o: {channelId: string}) => void;

      name: string;
      email: string;
      emails: string[] = [];

      complete = false;
      submitting = false;

      static $inject = ['channelService'];
      constructor(public channelService) {}

      add() {
        if (!this.email) return;
        const sanitizedEmail = OnboardingChannelCtrl.sanitizeEmail(this.email);
        if (this.emails.indexOf(sanitizedEmail) !== -1) return;
        this.emails.unshift(sanitizedEmail);
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
        let channelId;
        this.channelService.create({name: this.name})
          .then(channel => {
            channelId = channel.id;
            return Promise.all(this.emails.map(email => {
              return this.channelService.invitationCreate(channel.id, {
                email,
                roles: ['member'],
              });
            }));
          })
          .then(() => {
            this.complete = true;
            this.onNext({channelId});
          })
          .finally(() => this.submitting = false);
      }
    },
    template: require('./onboarding-channel.html'),
  });
};
