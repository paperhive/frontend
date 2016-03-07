export default function(app) {

  app.controller('IntrojsCtrl', [
    '$scope',
    function($scope) {
      $scope.IntroOptions = {
        steps: [
          {
            element: '#introjs-pdf',
            intro: 'Select text and start a discussion.',
            position: 'top'
          },
          {
            element: '#introjs-search',
            intro: 'Search for the last article you\'ve read.',
            position: 'bottom'
          },
          {
            element: '#introjs-hive',
            intro: 'Hive the article to add it to your collection and receive updates.',
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
        exitOnOverlayClick: true,
        exitOnEsc: true,
        nextLabel: '<strong>Next</strong>',
        prevLabel: '<span style=\'color:green\'>Previous</span>',
        skipLabel: 'Exit',
        doneLabel: 'Thanks'
      };
    }]);
};
