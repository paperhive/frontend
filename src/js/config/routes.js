module.exports = function (app) {

  app.config([
    '$routeSegmentProvider', '$routeProvider',
    function($routeSegmentProvider, $routeProvider) {
      $routeSegmentProvider
        .when('/', 'main')
        .when('/welcome', 'welcome')
        .when('/oauth/orcid', 'oauth')
        .when('/articles', 'article')
        .when('/articles/new', 'article-new')
        .when('/articles/:id', 'article.info')
        .when('/articles/:id/text', 'article.text')
        .when('/articles/:id/annotations', 'article.annotations')
        .when('/articles/:id/annotations/new', 'article.annotations-new')
        .when('/articles/:id/annotations/:num', 'article.discussion')
        .when('/articles/:id/settings', 'article.settings')
        .when('/users/', 'userlist')
        .when('/users/:username', 'user')

        // Init Main Page
        .segment('main',{
          templateUrl: 'templates/main/main.html'
        })

        .segment('welcome', {
          templateUrl: 'templates/auth/welcome.html',
          controller: 'WelcomeCtrl'
        })

        .segment('oauth', {
          templateUrl: 'templates/auth/oauth.html',
          controller: 'OauthOrcidCtrl'
        })

        .segment('userlist', {
          templateUrl: 'templates/user/list.html'
        })

        .segment('user', {
          templateUrl: 'templates/user/index.html',
          dependencies: ['username']
        })

        .segment('article-new', {
          templateUrl: 'templates/article/new.html'
        })

        .segment('article', {
          templateUrl: 'templates/article/index.html'
        })
        .within()
        .segment('text', {
          default: true,
          templateUrl: 'templates/article/text/index.html',
          dependencies: ['id'],
          resolve: {
            data: function($timeout) {
              return $timeout(function() { return 'SLOW DATA CONTENT'; }, 1000);
            }
          },
          untilResolved: {
            templateUrl: 'templates/shared/progress-bar.html'
          }
        })
        .segment('annotations', {
          templateUrl: 'templates/article/discussion/list.html',
          dependencies: ['id']
        })
        .segment('discussion', {
          templateUrl: 'templates/article/discussion/index.html',
          dependencies: ['num']
        })
        .segment('annotations-new', {
          templateUrl: 'templates/article/discussion/new.html',
          dependencies: ['id']
        })
        .segment('settings', {
          templateUrl: 'templates/article/settings.html',
          dependencies: ['id']
        })
        ;

      $routeProvider.otherwise({redirectTo: '/articles/0af5e13'});
    }
  ]);
};
