module.exports = function (app) {

  app.config([
    '$routeSegmentProvider', '$routeProvider',
    function($routeSegmentProvider, $routeProvider) {
      $routeSegmentProvider
        .when('/', 'main')
        .when('/welcome', 'welcome')
        .when('/oauth/orcid', 'oauth')
        .when('/articles', 'article')
        .when('/articles/new', 'article.new')
        .when('/articles/:id', 'article')
        .when('/articles/:id/text', 'article.text')
        .when('/articles/:id/comments', 'article.comments')
        .when('/articles/:id/comments/new', 'article.comments.new')
        .when('/articles/:id/comments/:num', 'article.comments.num')
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

        .segment('article', {
          templateUrl: 'templates/article/index.html'
        })
        .within()
        .segment('new', {
          templateUrl: 'templates/article/new.html'
        })
        .segment('text', {
          default: true,
          templateUrl: 'templates/article/text/index.html',
          dependencies: ['id']
        })
        .segment('comments', {
          templateUrl: 'templates/article/comment/index.html',
          dependencies: ['id']
        })
        .within()
        .segment('list', {
          default: true,
          templateUrl: 'templates/article/comment/list.html',
        })
        .segment('new', {
          templateUrl: 'templates/article/comment/new.html',
        })
        .segment('num', {
          templateUrl: 'templates/article/comment/discussion.html',
          dependencies: ['num']
        })
        .up()
        .segment('settings', {
          templateUrl: 'templates/article/settings.html',
          dependencies: ['id']
        })
        ;

      $routeProvider.otherwise({redirectTo: '/articles/0af5e13'});
    }
  ]);
};
