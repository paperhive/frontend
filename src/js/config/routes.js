'use strict';
module.exports = function(app) {
  app.config([
    '$routeSegmentProvider', '$routeProvider',
    function($routeSegmentProvider, $routeProvider) {

      // definition of metadata
      var meta = {
        main: {
          title: 'PaperHive · Papers, alive.',
          description: 'Review, discuss, and improve research articles – ' +
            'together, on the spot and for free. Gain insight from the ' +
            'findings of others.',
          url: 'https://paperhive.org',
          logo: 'https://paperhive.org/static/img/logo.png',
          address: {
            street: 'Ackerstr. 76',
            postalCode: '13355',
            city: 'Berlin',
            country: 'Germany'
          },
          phone: '+493031478924'
        }
      };

      $routeSegmentProvider
        .when('/', 'main')
        .when('/404', '404')
        .when('/about-us', 'about-us')
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
        //.when('/help', 'help')
        .when('/jobs', 'jobs')
        .when('/alpha-warning', 'alpha-warning')
        .when('/legalnotice', 'legalnotice')
        .when('/oauth/orcid', 'oauth')
        .when('/settings', 'settings')
        .when('/settings/profile', 'settings.profile')
        .when('/settings/site', 'settings.site')
        .when('/subscribed', 'subscribed')
        .when('/users/:username', 'users')
        .when('/users/:username/profile', 'users.profile')
        .when('/users/:username/articles', 'users.articles')
        .when('/users/:username/activity', 'users.activity')
        .when('/welcome', 'welcome')

        // Init Main Page
        .segment('main', {
          templateUrl: 'templates/main/main.html',
          title: meta.main.title,
          meta: [
            {name: 'description', content: meta.main.description},
            // open graph
            {property: 'og:type', content: 'website'},
            {property: 'og:title', content: meta.main.title},
            {property: 'og:description', content: meta.main.description},
            {property: 'og:image', content: meta.main.logo},
            {property: 'og:url', content: meta.main.url},
            // twitter cards
            {name: 'twitter:card', content: 'summary'},
            {name: 'twitter:url', content: meta.main.url},
            {name: 'twitter:title', content: meta.main.title},
            {name: 'twitter:description', content: meta.main.description},
            {name: 'twitter:image', content: meta.main.logo}
          ],
          jsonld: [
            {
              '@context': 'http://schema.org',
              '@type': 'Organization',
              name: 'PaperHive',
              url: meta.main.url,
              logo: meta.main.logo,
              sameAs: [
                'https://plus.google.com/114787682678537396870',
                'https://twitter.com/paper_hive',
                'https://github.com/paperhive/',
                'https://www.youtube.com/channel/UCe4xC7kaff0ySd6yZuT2XYQ'
              ],
              address: {
                streetAddress: meta.main.address.street,
                postalCode: meta.main.address.postalCode,
                addressLocality: meta.main.address.city,
                addressCountry: meta.main.address.country
              },
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: meta.main.phone,
                  contactType: 'customer service'
                }
              ]
            }
          ]
        })
        // 404 page not found
        .segment('404', {
          templateUrl: 'templates/shared/404.html',
          title: '404 · page not found · PaperHive',
          meta: [
            {name: 'prerender-status-code', content: 404}
          ]
        })

        .segment('about-us', {
          templateUrl: 'templates/about-us.html',
          title: 'About us · PaperHive',
          meta: [
            {
              name: 'description',
              content: 'PaperHive is where research is discussed. ' +
                'We add a discussion layer on top of every research article ' +
                'and allow you to ask questions, share your knowledge, ' +
                'correct mistakes, point to further literature, code, or ' +
                'data.'
            }
          ]
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
          title: 'Contact · PaperHive',
          meta: [
            {
              name: 'description',
              content: 'Contact PaperHive and ask us questions or send us ' +
                'suggestions.'
            }
          ]
        })

        .segment('help', {
          templateUrl: 'templates/help/help.html',
          title: 'Help · PaperHive',
          meta: [
            {
              name: 'description',
              content: 'Learn how to discuss and review research articles ' +
                'efficiently and collaboratively on PaperHive.'
            }
          ]
        })

        .segment('jobs', {
          templateUrl: 'templates/jobs.html',
          title: 'Jobs · PaperHive',
          meta: [
            {
              name: 'description',
              content: 'Join the PaperHive team and help us to make ' +
                'research fun again.'
            }
          ]
        })

        .segment('legalnotice', {
          templateUrl: 'templates/legalnotice.html',
          title: 'Legal notice · PaperHive',
          meta: [
            {
              name: 'description',
              content: 'Information about the operators of PaperHive.'
            }
          ]
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

        .segment('subscribed', {
          templateUrl: 'templates/subscribed.html',
          title: 'Successfully subscribed · PaperHive'
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
