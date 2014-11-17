module.exports = function (app) {

  app.config(
    ['$routeSegmentProvider', function($routeSegmentProvider) {
    $routeSegmentProvider
    .when('/oauth', 'oauth')
    .when('/articles', 'article')
    .when('/articles/:id', 'article.info')
    .when('/articles/:id/text', 'article.text')
    .when('/articles/:id/annotations', 'article.annotations')
    .when('/articles/:id/settings', 'article.settings')

    .segment('oauth', {
      templateUrl: 'templates/oauth.html'
    })

    .segment('article', {
      templateUrl: 'templates/article.html'
    })
    .within()
    .segment('text', {
      default: true,
      templateUrl: 'templates/text.html',
      controller: 'DisplayCtrl',
      dependencies: ['id']
    })
    .segment('annotations', {
      templateUrl: 'templates/annotation-list.html',
      controller: 'IssueListCtrl',
      dependencies: ['id']
    })
    .segment('settings', {
      templateUrl: 'templates/settings.html',
      dependencies: ['id']
    })
    ;
  }]);
};
