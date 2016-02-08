export default function(app) {
  app.config([
    '$routeSegmentProvider', '$routeProvider',
    function($routeSegmentProvider, $routeProvider) {

      // definition of metadata
      const meta = {
        main: {
          title: 'PaperHive · The coworking hub for researchers',
          description: 'Greatly simplifying research communication and ' +
           'introducing new ways of collaboration through in-document ' +
           'discussions.',
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
        .when('/about', 'about')
        .when('/articles/new', 'articles_new')
        .when('/articles/:articleId', 'articles')
        .when('/articles/:articleId/activity', 'articles.activity')
        .when('/articles/:articleId/discussions', 'articles.discussions')
        .when('/articles/:articleId/discussions/new',
              'articles.discussions.new')
        .when('/articles/:articleId/discussions/:discussionId',
              'articles.discussions.thread')
        .when('/articles/:articleId/settings', 'articles.settings')
        .when('/articles/:articleId/text', 'articles.text')
        .when('/articles/:articleId/about', 'articles.about')
        .when('/contact', 'contact')
        // .when('/help', 'help')
        .when('/jobs', 'jobs')
        .when('/alpha-warning', 'alpha-warning')
        .when('/legalnotice', 'legalnotice')
        .when('/login', 'login')
        .when('/authReturn', 'authReturn')
        .when('/settings', 'settings')
        .when('/settings/profile', 'settings.profile')
        .when('/settings/site', 'settings.site')
        .when('/signup', 'signup')
        .when('/subscribed', 'subscribed')
        .when('/users/:username', 'users')
        .when('/users/:username/profile', 'users.profile')
        .when('/users/:username/articles', 'users.articles')
        .when('/users/:username/activity', 'users.activity')

        // Init Main Page
        .segment('main', {
          templateUrl: 'html/main/main.html',
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
                'https://twitter.com/paperhive',
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
          templateUrl: 'html/shared/404.html',
          title: '404 · page not found · PaperHive',
          meta: [
            {name: 'prerender-status-code', content: 404}
          ]
        })

        .segment('about', {
          templateUrl: 'html/about.html',
          title: 'About · PaperHive',
          meta: [
            {
              name: 'description',
              content: 'PaperHive is a Berlin-based startup that enables ' +
                'seamless discussion of research papers.'
            }
          ]
        })

        .segment('alpha-warning', {
          templateUrl: 'html/alpha-warning.html',
          title: 'Alpha warning · PaperHive'
        })

        .segment('articles', {
          templateUrl: 'html/articles/index.html',
          dependencies: ['articleId'],
          title: 'Article · PaperHive'
        })
        .within()
          .segment('activity', {
            templateUrl: 'html/articles/activity.html',
            title: 'Article activity · PaperHive'
          })
          .segment('discussions', {
            templateUrl: 'html/articles/discussions/index.html',
            title: 'Discussions · PaperHive'
          })
          .within()
            .segment('list', {
              default: true,
              templateUrl: 'html/articles/discussions/list.html',
              title: 'Discussions · PaperHive'
            })
            .segment('new', {
              templateUrl: 'html/articles/discussions/new.html',
              title: 'New discussion · PaperHive'
            })
            .segment('thread', {
              templateUrl: 'html/articles/discussions/thread.html',
              dependencies: ['discussionId'],
              title: 'Discussion · PaperHive'
            })
          .up()
          .segment('settings', {
            templateUrl: 'html/articles/settings.html',
            title: 'Article settings · PaperHive'
          })
          .segment('text', {
            default: true,
            templateUrl: 'html/articles/text.html',
            title: 'Article · PaperHive'
          })
        .up()
        .segment('articles_new', {
          templateUrl: 'html/articles/new.html',
          title: 'Add a New Article · PaperHive'
        })

        .segment('contact', {
          templateUrl: 'html/contact/contact.html',
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
          templateUrl: 'html/help/help.html',
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
          templateUrl: 'html/jobs.html',
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
          templateUrl: 'html/legalnotice.html',
          title: 'Legal notice · PaperHive',
          meta: [
            {
              name: 'description',
              content: 'Information about the operators of PaperHive.'
            }
          ]
        })

        .segment('login', {
          templateUrl: 'html/login.html',
          title: 'Log in to · Paperhive'
        })

        .segment('authReturn', {
          templateUrl: 'html/auth/return.html',
          controller: 'AuthReturnCtrl',
          title: 'PaperHive'
        })

        .segment('settings', {
          templateUrl: 'html/settings/index.html',
          title: 'Your profile · PaperHive'
        })
        .within()
          .segment('profile', {
            default: true,
            templateUrl: 'html/settings/profile.html'
          })
          .segment('site', {
            templateUrl: 'html/settings/site.html'
          })
        .up()

        .segment('signup', {
          templateUrl: 'html/signup.html',
          title: 'Sign up with · Paperhive'
        })

        .segment('subscribed', {
          templateUrl: 'html/subscribed.html',
          title: 'Successfully subscribed · PaperHive'
        })

        .segment('users', {
          templateUrl: 'html/users/index.html',
          dependencies: ['username'],
          title: 'User · PaperHive'
        })
        .within()
          .segment('profile', {
            default: true,
            templateUrl: 'html/users/profile.html',
            dependencies: ['username']
          })
          .segment('articles', {
            templateUrl: 'html/users/articles.html',
            dependencies: ['username']
          })
          .segment('activity', {
            templateUrl: 'html/users/activity.html',
            dependencies: ['username']
          })
        .up()
        ;

      $routeProvider.otherwise({redirectTo: '/404'});
    }
  ]);
};