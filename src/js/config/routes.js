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
          templateUrl: 'templates/main.html'
        })

        .segment('welcome', {
          templateUrl: 'templates/welcome.html',
          controller: 'WelcomeCtrl'
        })

        .segment('oauth', {
          templateUrl: 'templates/users/oauth.html',
          controller: 'OauthOrcidCtrl'
        })

        .segment('userlist', {
          templateUrl: 'templates/users/userlist.html'
        })

        .segment('user', {
          templateUrl: 'templates/users/user.html',
          dependencies: ['username']
        })

        .segment('article-new', {
          templateUrl: 'templates/article/article-new.html'
        })

        .segment('article', {
          templateUrl: 'templates/article/article.html'
        })
        .within()
        .segment('text', {
          default: true,
          templateUrl: 'templates/text.html',
          dependencies: ['id'],
          resolve: {
            data: function($timeout) {
              return $timeout(function() { return 'SLOW DATA CONTENT'; }, 1000);
            }
          },
          untilResolved: {
            templateUrl: 'templates/sharedObjects/progress-bar.html'
          }
        })
        .segment('annotations', {
          templateUrl: 'templates/article/discussion/discussions-list.html',
          dependencies: ['id']
        })
        .segment('discussion', {
          templateUrl: 'templates/article/discussion/discussion.html',
          dependencies: ['num']
        })
        .segment('annotations-new', {
          templateUrl: 'templates/article/discussion/discussion-new.html',
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
