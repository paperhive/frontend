require('./onboarding.less');

export default function(app) {
  app.component('onboardingPersonal', {
    bindings: {
      active: '<',
      onNext: '&',
    },
    controller: class OnboardingPersonalCtrl {
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

      static $inject = ['$scope', 'authService'];
      constructor($scope, public authService) {
        this.disciplineOptions = [...this.disciplines, 'Other'];
        this.occupationOptions = [...this.occupations, 'Other'];

        $scope.$watch('$ctrl.authService.user.discipline', this.updateDiscipline.bind(this));
        $scope.$watch('$ctrl.authService.user.occupation', this.updateOccupation.bind(this));
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
