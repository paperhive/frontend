module.exports = function (app) {

  app.config([
    '$routeSegmentProvider', '$routeProvider',
    function($routeSegmentProvider, $routeProvider) {
      $routeSegmentProvider
        .when('/', 'main')
        .when('/articles', 'article')
        .when('/articles/new', 'articlenew')
        .when('/articles/:articleId', 'article')
        .when('/articles/:articleId/activity', 'article.activity')
        .when('/articles/:articleId/comments', 'article.comments')
        .when('/articles/:articleId/comments/new', 'article.comments.new')
        .when('/articles/:articleId/comments/:num', 'article.comments.num')
        .when('/articles/:articleId/settings', 'article.settings')
        .when('/articles/:articleId/text', 'article.text')
        .when('/contact', 'contact')
        .when('/oauth/orcid', 'oauth')
        .when('/team', 'team')
        .when('/settings', 'settings')
        .when('/settings/profile', 'settings.profile')
        .when('/settings/site', 'settings.site')
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
            dependencies: ['articleId']
          })
          .segment('comments', {
            templateUrl: 'templates/article/comment/index.html',
            dependencies: ['articleId']
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
            dependencies: ['articleId']
          })
          .segment('text', {
            default: true,
            templateUrl: 'templates/article/text/index.html',
            dependencies: ['articleId']
          })
        .up()
        .segment('articlenew', {
          templateUrl: 'templates/article/new.html'
        })

        .segment('contact',{
          templateUrl: 'templates/contact/contact.html'
        })

        .segment('oauth', {
          templateUrl: 'templates/auth/oauth.html',
          controller: 'OauthOrcidCtrl'
        })

        .segment('settings', {
          templateUrl: 'templates/settings/index.html'
        })
        .within()
          .segment('profile', {
            default: true,
            templateUrl: 'templates/settings/profile.html'
          })
          .segment('site', {
            templateUrl: 'templates/settings/site.html'
          })
        .up()

        .segment('team', {
          templateUrl: 'templates/team/index.html'
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
