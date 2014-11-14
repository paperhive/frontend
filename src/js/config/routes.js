module.exports = function (app) {

  app.config(
    ['$routeProvider',
      function($routeProvider) {
        $routeProvider
        .when('/annotations', {
          templateUrl: 'templates/annotation-list.html',
          controller: 'IssueListCtrl'
        })
        .when('/text', {
          templateUrl: 'templates/text.html',
          controller: 'DisplayCtrl'
        })
        .when('/settings', {
          templateUrl: 'templates/settings.html'
        })
        .otherwise({
          redirectTo: '/text'
        });
      }]);

};
