export default function(app) {

  app.controller('IntrojsCtrl', [
    '$scope',
    function($scope) {
      $scope.IntroOptions = {

        // console.log('#introjs-pdf', document.querySelector('#introjs-pdf'));
        // iconsole.log('#introjs-pdf', document.querySelectorAll('#introjs-pdf'));
        // console.log('#introjs-title', document.querySelector('#introjs-title'));
        steps: [
          {
            element: document.querySelector('#introjs-pdf'),
            intro: 'Select text and start a discussion.',
            position: 'top'
          },
          {
            element: document.querySelector('#introjs-hive'),
            intro: 'Hive the article to add it to your collection and receive updates.',
            position: 'left'
          },
          {
            element: document.querySelector('#introjs-signup'),
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
