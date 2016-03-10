export default function(app) {

  app.controller('IntrojsCtrl', [
    '$scope', 'authService', '$location', '$rootScope',
    function($scope, authService, $location, $rootScope) {
      $scope.takeTour = false;
      $rootScope.$on('$locationChangeSuccess', function(event) {
        $scope.takeTour = $location.search().takeTour === 'true';
      });

      $scope.IntroOptions = {
        steps: [
          {
            element: '#introjs-paperhive-logo',
            intro: 'Welcome to PaperHive!',
            position: 'bottom'
          },
          {
            element: '#introjs-margin-discussion',
            intro: 'Someone started a discussion. Join by clicking on it and leave a reply! (Login required.)',
            position: 'left'
          },
          {
            element: '#introjs-pdf',
            intro: 'To start a new discussion, select some text. (Login required.)',
            position: 'top'
          },
          {
            element: '#srch-term',
            intro: 'Search for the last article you\'ve read.',
            position: 'bottom'
          },
          {
            element: '#introjs-hive',
            intro: 'Hive the article to add it to your collection and receive updates. (Login required.)',
            position: 'left'
          },
          {
            element: '#introjs-signup',
            intro: 'Sign up and have fun!',
            position: 'bottom'
          },
        ],
        showStepNumbers: false,
        showBullets: false,
        exitOnOverlayClick: false,
        exitOnEsc: true,
        nextLabel: '<strong>Next</strong>',
        prevLabel: 'Previous',
        doneLabel: 'Thanks'
      };

      $scope.auth = authService;
      $scope.$watch('auth.user', function(user) {
        if (user) {
          $scope.IntroOptions.steps = [
            {
              element: '#introjs-paperhive-logo',
              intro: 'Welcome to PaperHive!',
              position: 'bottom'
            },
            {
              element: '#introjs-margin-discussion',
              intro: 'Someone started a discussion. Join by clicking on it and leave a reply!',
              position: 'left'
            },
            {
              element: '#introjs-pdf',
              intro: 'To start a new discussion, select some text.',
              position: 'top'
            },
            {
              element: '#srch-term',
              intro: 'Search for the last article you\'ve read.',
              position: 'bottom'
            },
            {
              element: '#introjs-hive',
              intro: 'Hive the article to add it to your collection and receive updates.',
              position: 'left'
            },
          ];
        }
      });
    }]);
};
