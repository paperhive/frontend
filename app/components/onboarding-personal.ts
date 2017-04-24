import { cloneDeep } from 'lodash';

require('./onboarding.less');

export default function(app) {
  app.component('onboardingPersonal', {
    bindings: {
      active: '<',
      onNext: '&',
    },
    controller: class OnboardingPersonalCtrl {
      onNext: () => void;

      const disciplines = [
        'Agricultural Sciences',
        'Architecture',
        'Biochemistry',
        'Biology',
        'Business and Management',
        'Chemistry',
        'Computer Science',
        'Dentistry',
        'Earth Sciences',
        'Economics and Finance',
        'Engineering',
        'Environmental Science',
        'Graphic Design',
        'History',
        'Law',
        'Linguistics',
        'Literature',
        'Materials Science',
        'Mathematics',
        'Medicine',
        'Microbiology',
        'Musicology',
        'Neuroscience',
        'Nursing',
        'Pharmacology',
        'Philosophy',
        'Physics',
        'Psychology',
        'Social Sciences',
        'Sports Science',
        'Veterinary Medicine',
      ];
      disciplineOptions: string[];
      disciplineSelect: string;
      disciplineText: string;

      const occupations = [
        'Professor',
        'Postdoc',
        'PhD student',
        'Student',
      ];
      occupationOptions: string[];
      occupationSelect: string;
      occupationText: string;

      submitting = false;
      complete = false;

      displayName: string;
      email: string;

      static $inject = ['$scope', 'authService', 'personService'];
      constructor($scope, public authService, public personService) {
        this.disciplineOptions = [...this.disciplines, 'Other'];
        this.occupationOptions = [...this.occupations, 'Other'];

        $scope.$watch('$ctrl.authService.user.displayName', displayName => this.displayName = displayName);
        $scope.$watch('$ctrl.authService.user.discipline', this.updateDiscipline.bind(this));
        $scope.$watch('$ctrl.authService.user.occupation', this.updateOccupation.bind(this));
      }

      next() {
        this.submitting = true;

        // TODO: email

        const person = cloneDeep(this.authService.user);
        person.displayName = this.displayName;
        person.discipline = this.disciplineSelect !== 'Other'
          ? this.disciplineSelect : this.disciplineText;
        person.occupation = this.occupationSelect !== 'Other'
          ? this.occupationSelect : this.occupationText;

        this.personService.update(person)
          .then(() => {
            this.complete = true;
            this.onNext();
          })
          .finally(() => {
            this.submitting = false;
          });
      }

      updateDiscipline(discipline) {
        this.disciplineText = undefined;
        if (!discipline) {
          this.disciplineSelect = '';
          return;
        }
        if (this.disciplines.indexOf(discipline) !== -1) {
          this.disciplineSelect = discipline;
          return;
        }
        this.disciplineSelect = 'Other';
        this.disciplineText = discipline;
      }

      updateOccupation(occupation) {
        this.occupationText = undefined;
        if (!occupation) {
          this.occupationSelect = '';
          return;
        }
        if (this.occupations.indexOf(occupation) !== -1) {
          this.occupationSelect = occupation;
          return;
        }
        this.occupationSelect = 'Other';
        this.occupationText = occupation;
      }
    },
    template: require('./onboarding-personal.html'),
  });
};
