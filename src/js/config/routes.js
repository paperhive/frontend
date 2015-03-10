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
        .when('/articles/:articleId/comments/:discussionIndex',
              'article.comments.index')
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
          templateUrl: 'templates/articles/index.html'
        })
        .within()
          .segment('activity', {
            templateUrl: 'templates/articles/activity.html',
            dependencies: ['articleId']
          })
          .segment('comments', {
            templateUrl: 'templates/articles/comment/index.html',
            dependencies: ['articleId']
          })
          .within()
            .segment('list', {
              default: true,
              templateUrl: 'templates/articles/comment/list.html',
            })
            .segment('new', {
              templateUrl: 'templates/articles/comment/new.html',
            })
            .segment('index', {
              templateUrl: 'templates/articles/comment/discussion.html',
              dependencies: ['discussionIndex']
            })
          .up()
          .segment('settings', {
            templateUrl: 'templates/articles/settings.html',
            dependencies: ['articleId']
          })
          .segment('text', {
            default: true,
            templateUrl: 'templates/articles/text/index.html',
            dependencies: ['articleId']
          })
        .up()
        .segment('articlenew', {
          templateUrl: 'templates/articles/new.html'
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
          templateUrl: 'templates/users/list.html'
        })

        .segment('user', {
          templateUrl: 'templates/users/index.html',
          dependencies: ['username']
        })
        .within()
          .segment('profile', {
            default: true,
            templateUrl: 'templates/users/profile.html',
            dependencies: ['username']
          })
          .segment('articles', {
            templateUrl: 'templates/users/articles.html',
            dependencies: ['username']
          })
          .segment('comments', {
            templateUrl: 'templates/users/comments.html',
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
