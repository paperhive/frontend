module.exports = function (app) {

  app.config(
    ['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/articles/:id', {
          templateUrl: 'templates/article.html',
        })
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
        .when('/oauth/orcid', {
          templateUrl: 'templates/oauth.html',
          controller: 'OauthOrcidCtrl'
        })
        .otherwise({
          redirectTo: '/articles/0af5e13'
        });
      }]);

};
