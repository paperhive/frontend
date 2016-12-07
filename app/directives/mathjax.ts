import MathJax from 'mathjax';

export default function(app) {
  app.directive('mathjax', ['$sanitize', 'notificationService',
    function($sanitize, notificationService) {
      return {
        restrict: 'E',
        scope: {body: '='},
        link: (scope, element, attrs) => {
          scope.$watch('body', function(body) {
            try {
              element.html($sanitize(body || ''));
              MathJax.Hub.Queue(['Typeset', MathJax.Hub, element[0]]);
            } catch (e) {
              notificationService.notifications.push({
                type: 'error',
                message: e.message,
              });
            }
          });
        },
      };
    },
  ]);
};
