module.exports = function (app) {

  app.config([
    '$routeSegmentProvider', '$routeProvider',
    function($routeSegmentProvider, $routeProvider) {
      $routeSegmentProvider
        .when('/welcome', 'welcome')
        .when('/oauth/orcid', 'oauth')
        .when('/articles', 'article')
        .when('/articles/new', 'article-new')
        .when('/articles/:id', 'article.info')
        .when('/articles/:id/text', 'article.text')
        .when('/articles/:id/annotations', 'article.annotations')
        .when('/articles/:id/annotations/new', 'article.annotation-new')
        .when('/articles/:id/annotations/:num', 'article.annotation')
        .when('/articles/:id/settings', 'article.settings')
        .when('/users/', 'userlist')
        .when('/users/:username', 'user')

        .segment('welcome', {
          templateUrl: 'templates/welcome.html',
          controller: 'WelcomeCtrl'
        })

        .segment('oauth', {
          templateUrl: 'templates/oauth.html',
          controller: 'OauthOrcidCtrl'
        })

        .segment('userlist', {
          templateUrl: 'templates/userlist.html'
        })

        .segment('user', {
          templateUrl: 'templates/user.html',
          dependencies: ['username']
        })

        .segment('article-new', {
          templateUrl: 'templates/article-new.html'
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
          controller: 'AnnotationListCtrl',
          dependencies: ['id']
        })
        .segment('annotation', {
          templateUrl: 'templates/annotation.html',
          dependencies: ['id', 'num']
        })
        .segment('annotation-new', {
          templateUrl: 'templates/annotation-new.html',
          dependencies: ['id']
        })
        .segment('settings', {
          templateUrl: 'templates/settings.html',
          dependencies: ['id']
        })
        ;

      $routeProvider.otherwise({redirectTo: '/articles/0af5e13'});
    }
  ]);
};
