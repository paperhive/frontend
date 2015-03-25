'use strict';
module.exports = function(app) {
  app.config([
    '$routeSegmentProvider', '$routeProvider',
    function($routeSegmentProvider, $routeProvider) {
      $routeSegmentProvider
        .when('/', 'main')
        .when('/articles/new', 'articles_new')
        .when('/articles/:articleId', 'articles')
        .when('/articles/:articleId/activity', 'articles.activity')
        .when('/articles/:articleId/discussions', 'articles.discussions')
        .when('/articles/:articleId/discussions/new',
              'articles.discussions.new')
        .when('/articles/:articleId/discussions/:discussionIndex',
              'articles.discussions.thread')
        .when('/articles/:articleId/settings', 'articles.settings')
        .when('/articles/:articleId/text', 'articles.text')
        .when('/contact', 'contact')
        .when('/oauth/orcid', 'oauth')
        .when('/settings', 'settings')
        .when('/settings/profile', 'settings.profile')
        .when('/settings/site', 'settings.site')
        .when('/team', 'team')
        .when('/users/:username', 'users')
        .when('/users/:username/profile', 'users.profile')
        .when('/users/:username/articles', 'users.articles')
        .when('/users/:username/activity', 'users.activity')
        .when('/welcome', 'welcome')

        // Init Main Page
        .segment('main', {
          templateUrl: 'templates/main/main.html',
          title: 'PaperHub'
        })
        .segment('articles', {
          templateUrl: 'templates/articles/index.html',
          dependencies: ['articleId'],
          title: 'Article'
        })
        .within()
          .segment('activity', {
            templateUrl: 'templates/articles/activity.html',
            title: 'Article activity'
          })
          .segment('discussions', {
            templateUrl: 'templates/articles/discussions/index.html',
            title: 'Discussions'
          })
          .within()
            .segment('list', {
              default: true,
              templateUrl: 'templates/articles/discussions/list.html',
              title: 'Discussions'
            })
            .segment('new', {
              templateUrl: 'templates/articles/discussions/new.html',
              title: 'New discussions'
            })
            .segment('thread', {
              templateUrl: 'templates/articles/discussions/thread.html',
              dependencies: ['discussionIndex'],
              title: 'Discussion'
            })
          .up()
          .segment('settings', {
            templateUrl: 'templates/articles/settings.html',
            title: 'Article settings'
          })
          .segment('text', {
            default: true,
            templateUrl: 'templates/articles/text.html',
            title: 'Article'
          })
        .up()
        .segment('articles_new', {
          templateUrl: 'templates/articles/new.html',
          title: 'New article'
        })

        .segment('contact', {
          templateUrl: 'templates/contact/contact.html',
          title: 'Contact'
        })

        .segment('oauth', {
          templateUrl: 'templates/auth/oauth.html',
          controller: 'OauthOrcidCtrl'
        })

        .segment('settings', {
          templateUrl: 'templates/settings/index.html',
          title: 'Settings'
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
          templateUrl: 'templates/team/index.html',
          title: 'PaperHub team'
        })

        .segment('users', {
          templateUrl: 'templates/users/index.html',
          dependencies: ['username'],
          title: 'User'
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
          .segment('activity', {
            templateUrl: 'templates/users/activity.html',
            dependencies: ['username']
          })
        .up()

        .segment('welcome', {
          templateUrl: 'templates/welcome.html',
          controller: 'WelcomeCtrl',
          title: 'PaperHub'
        })
        ;

      $routeProvider.otherwise({redirectTo: '/'});
    }
  ]);
};
