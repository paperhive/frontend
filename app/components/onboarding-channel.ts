import { cloneDeep, get } from 'lodash';

require('./onboarding.less');
require('./onboarding-channel.less');

export default function(app) {
  app.component('onboardingChannel', {
    bindings: {
      active: '<',
      onNext: '&',
    },
    controller: class OnboardingChannelCtrl {
      onNext: () => void;

      name: string;
      email: string;
      emails: string[] = [];

      createNew = false;
      submitting = false;

      static $inject = ['$timeout', 'authService', 'channelService', 'personService'];
      constructor(public $timeout, public authService, public channelService, public personService) {}

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
        if (get(this.authService.user.account, 'onboarding.channel.completedAt') && !this.createNew) {
          this.onNext();
          return;
        }

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
            const person = cloneDeep(this.authService.user);
            person.account.onboarding = person.account.onboarding || {};
            person.account.onboarding.channel = {
              completedAt: new Date(),
              channel: channelId,
            };
            return this.personService.update(person);
          })
          .then(() => this.$timeout(800))
          .then(() => this.onNext())
          .finally(() => this.submitting = false);
      }
    },
    template: require('./onboarding-channel.html'),
  });
};
