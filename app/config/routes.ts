export default function(app) {
  app.config([
    '$routeSegmentProvider', '$routeProvider',
    function($routeSegmentProvider, $routeProvider) {

      // definition of metadata
      const meta = {
        main: {
          title: 'PaperHive · The coworking hub for researchers',
          description: 'Simplifying research communication and ' +
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
        .when('/auth/return/:provider', 'authReturn')
        // register new and redirect before id-dependent routes
        .when('/documents/new', 'documents_new')
        .when('/documents/redirect', 'documents_redirect')
        .when('/documents/:documentId', 'documents', {reloadOnSearch: false})
        .when('/documents/:documentId/activity', 'documents.activity')
        .when('/documents/:documentId/discussions', 'documents.discussions')
        .when('/documents/:documentId/hivers', 'documents.hivers')
        // .when('/documents/:documentId/discussions/new',
        //       'documents.discussions.new')
        .when('/documents/:documentId/discussions/:discussionId',
              'documents.discussions.thread')
        .when('/documents/:documentId/text', 'documents.text', {reloadOnSearch: false})
        .when('/documents/:documentId/revisions/:revisionId', 'documents.revisions')
        .when('/documents/:documentId/about', 'documents.about')
        .when('/contact', 'contact')
        .when('/terms', 'terms')
        .when('/jobs', 'jobs')
        .when('/knowledgeunlatched', 'knowledgeunlatched')
        .when('/legalnotice', 'legalnotice')
        .when('/login', 'login')
        .when('/password/request', 'passwordRequest')
        .when('/password/reset', 'passwordReset')
        .when('/publishers', 'publishers')
        .when('/search', 'search')
        .when('/settings', 'settings')
        .when('/settings/profile', 'settings.profile')
        .when('/settings/site', 'settings.site')
        .when('/signup', 'signup')
        .when('/subscribed', 'subscribed')
        .when('/users/:username', 'users')
        .when('/users/:username/activity', 'users.activity')
        .when('/users/:username/profile', 'users.profile')

        // Init Main Page
        .segment('main', {
          template: '<main-page></main-page>',
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
          template: '<not-found></not-found>',
          title: '404 · page not found · PaperHive',
          meta: [
            {name: 'prerender-status-code', content: 404}
          ]
        })

        .segment('about', {
          template: '<about></about>',
          title: 'About · PaperHive',
          meta: [
            {
              name: 'description',
              content: 'PaperHive is a Berlin-based startup that enables ' +
                'seamless discussion of research papers.'
            }
          ]
        })

        .segment('authReturn', {
          template: '<auth-return></auth-return>',
          title: 'PaperHive'
        })

        .segment('documents', {
          template: '<document></document>',
          dependencies: ['documentId'],
          title: 'Document · PaperHive',
        })
        .within()
          .segment('activity', {
            template: `<div class="container">
                <div class="row">
                  <div class="col-sm-1 col-xs-1"></div>
                  <div class="col-md-12 col-sm-10 col-xs-9">
                    <activity document="$ctrl.documentId"></activity>
                  </div>
                </div>
              </div>`,
            title: 'Activity · PaperHive'
          })
          .segment('hivers', {
            template: '<hivers document-id="$ctrl.documentId"></hivers>',
            title: 'Hivers · PaperHive'
          })
          .segment('discussions', {
            template: `<div
              ng-if="$ctrl.discussionsCtrl.discussions"
              app-view-segment="2"
            ></div>`,
            title: 'Discussions · PaperHive'
          })
          .within()
            .segment('list', {
              default: true,
              template: `<discussion-list
                document-revision="$ctrl.latestRevision"
                discussions="$ctrl.discussionsCtrl.discussions"
              ></discussion-list>`,
              title: 'Discussions · PaperHive'
            })
            .segment('thread', {
              // Ideally, we'd already provide the exact discussion here,
              // rather than all discussions and the discussionId.
              template: `<discussion-thread-view
                discussions="$ctrl.discussionsCtrl.discussions"
                on-discussion-update="$ctrl.discussionsCtrl.discussionUpdate(discussion)"
                on-reply-submit="$ctrl.discussionsCtrl.replySubmit(reply)"
                on-reply-update="$ctrl.discussionsCtrl.replyUpdate(reply)"
                on-reply-delete="$ctrl.discussionsCtrl.replyDelete(reply)"
              ></discussion-thread-view>`,
              dependencies: ['discussionId'],
              title: 'Discussion · PaperHive'
            })
          .up()
          .segment('text', {
            default: true,
            templateUrl: 'html/documents/text.html',
            title: 'Document · PaperHive',
          })
          .segment('revisions', {
            templateUrl: 'html/documents/text.html',
            dependencies: ['revisionId'],
            title: 'Document at revision · PaperHive'
          })
        .up()
        .segment('documents_new', {
          template: '<document-new></document-new>',
          title: 'Add a New Document · PaperHive'
        })
        .segment('documents_redirect', {
          template: '<document-redirect></document-redirect>',
          title: 'Document redirect · PaperHive'
        })

        .segment('contact', {
          template: '<contact></contact>',
          title: 'Contact · PaperHive',
          meta: [
            {
              name: 'description',
              content: 'Contact PaperHive and ask us questions or send us ' +
                'suggestions.'
            }
          ]
        })

        .segment('terms', {
          template: '<terms></terms>',
          title: 'Terms and Privacy Policy · PaperHive',
          meta: [
            {
              name: 'description',
              content: 'Terms and Privacy Policy'
            }
          ]
        })

        .segment('jobs', {
          template: '<jobs></jobs>',
          title: 'Jobs · PaperHive',
          meta: [
            {
              name: 'description',
              content: 'Join the PaperHive team and help us to make ' +
                'research fun again.'
            }
          ]
        })

        .segment('knowledgeunlatched', {
          template: '<documents-list></documents-list>',
          title: 'Knowledge Unlatched books'
        })

        .segment('legalnotice', {
          template: '<legal-notice></legal-notice>',
          title: 'Legal notice · PaperHive',
          meta: [
            {
              name: 'description',
              content: 'Information about the operators of PaperHive.'
            }
          ]
        })

        .segment('login', {
          template: '<login></login>',
          title: 'Log in to · Paperhive'
        })

        .segment('search', {
          template: '<search-results></search-results>',
          title: 'Search results',
        })

        .segment('passwordRequest', {
          template: '<password-request></password-request>',
          title: 'Reset your password · PaperHive',
        })

        .segment('passwordReset', {
          template: '<password-reset></password-reset>',
          title: 'Reset your password · PaperHive',
        })

        .segment('publishers', {
          template: '<publishers></publishers>',
          title: 'PaperHive for Publishers and repositories · Paperhive'
        })

        .segment('settings', {
          template: '<settings></settings>',
          title: 'Your profile · PaperHive'
        })
        .within()
          .segment('profile', {
            default: true,
            template: `<settings-profile user="user"></settings-profile>`
          })
        .up()

        .segment('signup', {
          template: '<signup></signup>',
          title: 'Sign up for · Paperhive'
        })

        .segment('subscribed', {
          template: '<subscribed></subscribed>',
          title: 'Successfully subscribed · PaperHive'
        })

        .segment('users', {
          template: '<user></user>',
          dependencies: ['username'],
          title: 'User · PaperHive'
        })
        .within()
          .segment('profile', {
            default: true,
            template: '<user-profile user="user"></user-profile>',
            dependencies: ['username']
          })
          .segment('activity', {
            template: `<activity user="user"></activity>`
          })
        .up()
        ;

      $routeProvider.otherwise({redirectTo: '/404'});
    }
  ]);
};
