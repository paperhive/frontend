module.exports = function (app) {

  app.config([
    '$routeSegmentProvider', '$routeProvider',
    function($routeSegmentProvider, $routeProvider) {
      $routeSegmentProvider
        .when('/', 'main')
        .when('/articles', 'article')
        .when('/articles/new', 'article.new')
        .when('/articles/:id', 'article')
        .when('/articles/:id/activity', 'article.activity')
        .when('/articles/:id/comments', 'article.comments')
        .when('/articles/:id/comments/new', 'article.comments.new')
        .when('/articles/:id/comments/:num', 'article.comments.num')
        .when('/articles/:id/settings', 'article.settings')
        .when('/articles/:id/text', 'article.text')
        .when('/oauth/orcid', 'oauth')
        .when('/settings', 'settings')
        .when('/users/', 'userlist')
        .when('/users/:username', 'user')
        .when('/users/:username/profile', 'user.profile')
        .when('/users/:username/articles', 'user.articles')
        .when('/users/:username/comments', 'user.comments')
        .when('/welcome', 'welcome')

        // Init Main Page
        .segment('main',{
          templateUrl: 'templates/main/main.html'
        })

        .segment('article', {
          templateUrl: 'templates/article/index.html'
        })
        .within()
          .segment('activity', {
            templateUrl: 'templates/article/activity.html',
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
          .segment('new', {
            templateUrl: 'templates/article/new.html'
          })
          .segment('settings', {
            templateUrl: 'templates/article/settings.html',
            dependencies: ['id']
          })
          .segment('text', {
            default: true,
            templateUrl: 'templates/article/text/index.html',
            dependencies: ['id']
          })
        .up()

        .segment('oauth', {
          templateUrl: 'templates/auth/oauth.html',
          controller: 'OauthOrcidCtrl'
        })

        .segment('settings', {
          templateUrl: 'templates/settings/index.html'
        })

        .segment('userlist', {
          templateUrl: 'templates/user/list.html'
        })

        .segment('user', {
          templateUrl: 'templates/user/index.html',
          dependencies: ['username']
        })
        .within()
          .segment('profile', {
            default: true,
            templateUrl: 'templates/user/profile.html',
            dependencies: ['username']
          })
          .segment('articles', {
            templateUrl: 'templates/user/articles.html',
            dependencies: ['username']
          })
          .segment('comments', {
            templateUrl: 'templates/user/comments.html',
            dependencies: ['username']
          })
        .up()

        .segment('welcome', {
          templateUrl: 'templates/auth/welcome.html',
          controller: 'WelcomeCtrl'
        })
        ;

      $routeProvider.otherwise({redirectTo: '/articles/0af5e13'});
    }
  ]);
};
