'use strict';
module.exports = function(app) {
  app.config([
    '$routeSegmentProvider', '$routeProvider',
    function($routeSegmentProvider, $routeProvider) {
      $routeSegmentProvider
        .when('/', 'main')
        .when('/404', '404')
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
        .when('/articles/:articleId/about', 'articles.about')
        .when('/contact', 'contact')
        .when('/help', 'help')
        .when('/alpha-warning', 'alpha-warning')
        .when('/legalnotice', 'legalnotice')
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
          title: 'PaperHive · Papers, alive.',
          description: 'Review, discuss, and improve research articles – ' +
            'together, on the spot and for free. Gain insight from the ' +
            'findings of others.'
        })
        // 404 page not found
        .segment('404', {
          templateUrl: 'templates/shared/404.html',
          title: '404 · page not found · PaperHive',
          statusCode: 404
        })

        .segment('alpha-warning', {
          templateUrl: 'templates/alpha-warning.html',
          title: 'Alpha warning · PaperHive'
        })

        .segment('articles', {
          templateUrl: 'templates/articles/index.html',
          dependencies: ['articleId'],
          title: 'Article · PaperHive'
        })
        .within()
          .segment('activity', {
            templateUrl: 'templates/articles/activity.html',
            title: 'Article activity · PaperHive'
          })
          .segment('discussions', {
            templateUrl: 'templates/articles/discussions/index.html',
            title: 'Discussions · PaperHive'
          })
          .within()
            .segment('list', {
              default: true,
              templateUrl: 'templates/articles/discussions/list.html',
              title: 'Discussions · PaperHive'
            })
            .segment('new', {
              templateUrl: 'templates/articles/discussions/new.html',
              title: 'New discussion · PaperHive'
            })
            .segment('thread', {
              templateUrl: 'templates/articles/discussions/thread.html',
              dependencies: ['discussionIndex'],
              title: 'Discussion · PaperHive'
            })
          .up()
          .segment('settings', {
            templateUrl: 'templates/articles/settings.html',
            title: 'Article settings · PaperHive'
          })
          .segment('about', {
            templateUrl: 'templates/articles/about.html',
            title: 'About the article · PaperHive'
          })
          .segment('text', {
            default: true,
            templateUrl: 'templates/articles/text.html',
            title: 'Article · PaperHive'
          })
        .up()
        .segment('articles_new', {
          templateUrl: 'templates/articles/new.html',
          title: 'Add a New Article · PaperHive'
        })

        .segment('contact', {
          templateUrl: 'templates/contact/contact.html',
          controller: 'ContactCtrl',
          title: 'Contact · PaperHive',
          description: 'Contact PaperHive and ask us questions or send us ' +
            'suggestions.'
        })

        .segment('help', {
          templateUrl: 'templates/help/help.html',
          title: 'Help · PaperHive',
          description: 'Learn how to discuss and review research articles ' +
            'efficiently and collaboratively on PaperHive.'
        })

        .segment('legalnotice', {
          templateUrl: 'templates/legalnotice.html',
          title: 'Legal notice · PaperHive',
          description: 'Information about the operators of PaperHive.'
        })

        .segment('oauth', {
          templateUrl: 'templates/auth/oauth.html',
          controller: 'OauthOrcidCtrl',
          title: 'OAuth login · PaperHive'
        })

        .segment('settings', {
          templateUrl: 'templates/settings/index.html',
          title: 'Your profile · PaperHive'
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
          title: 'Team · PaperHive',
          description: 'Meet the team who builds PaperHive.'
        })

        .segment('users', {
          templateUrl: 'templates/users/index.html',
          dependencies: ['username'],
          title: 'User · PaperHive'
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
          title: 'Welcome · PaperHive'
        })
        ;

      $routeProvider.otherwise({redirectTo: '/404'});
    }
  ]);
};
