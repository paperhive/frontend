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
        .when('/channels', 'channels')
        .when('/channels/list', 'channels.list' )
        .when('/channels/invitations', 'channels.invitations')
        .when('/channels/new', 'channelsNew')
        .when('/channels/:channelId', 'channel')
        .when('/channels/:channelId/activity', 'channel.activity')
        .when('/channels/:channelId/bookmarks', 'channel.bookmarks')
        .when('/channels/:channelId/invitations', 'channel.invitations')
        .when('/channels/:channelId/members', 'channel.members')
        .when('/channels/:channelId/settings', 'channel.settings')
        .when('/contact', 'contact')
        // register new and remote before id-dependent routes
        .when('/documents/new', 'documents_new')
        .when('/documents/remote', 'documents_remote')
        .when('/documents/:documentId', 'documents', {reloadOnSearch: false})
        .when('/documents/:documentId/activity', 'documents.activity')
        .when('/documents/:documentId/discussions', 'documents.discussions')
        .when('/documents/:documentId/hivers', 'documents.hivers')
        // .when('/documents/:documentId/discussions/new',
        //       'documents.discussions.new')
        .when('/documents/:documentId/discussions/:discussionId',
              'documents.discussions.thread')
        .when('/documents/:documentId/text', 'documents.text', {reloadOnSearch: false})
        .when('/documents/:documentId/revisions/:revisionId', 'documents.revisions', {reloadOnSearch: false})
        .when('/documents/:documentId/about', 'documents.about')
        .when('/help/markdown', 'helpMarkdown')
        .when('/jobs', 'jobs')
        .when('/knowledgeunlatched', 'knowledgeunlatched')
        .when('/legalnotice', 'legalnotice')
        .when('/login', 'login')
        .when('/partners', 'partners')
        .when('/password/request', 'passwordRequest')
        .when('/password/reset', 'passwordReset')
        .when('/publishers', 'publishers')
        .when('/return/channelInvitation', 'channelInvitationConfirm')
        .when('/search', 'search')
        .when('/settings', 'settings')
        .when('/settings/profile', 'settings.profile')
        .when('/settings/site', 'settings.site')
        .when('/signup', 'signup')
        .when('/subscribed', 'subscribed')
        .when('/terms', 'terms')
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

        .segment('channelInvitationConfirm', {
          template: '<channel-invitation-confirm></channel-invitation-confirm>',
          title: 'Confirm your invitation · PaperHive',
        })
        .segment('channels', {
          template: '<channels></channels>',
          title: 'My channels · PaperHive',
        })
        .within()
          .segment('list', {
            default: true,
            template: '<channels-list></channels-list>',
            title: 'My channels · PaperHive',
          })
          .segment('invitations', {
            template: '<channels-invitations></channels-invitations>',
            title: 'My invitations · PaperHive',
          })
        .up()

        .segment('channelsNew', {
          template: '<channel-new></channel-new>',
          title: 'Add a new channel · PaperHive'
        })

        .segment('channel', {
          template: '<channel></channel',
        })
        .within()
          .segment('activity', {
            default: true,
            template:
              `<activity
                filter-mode="channel"
                filter-id="$ctrl.channel.id"
              ></activity>`,
            title: 'Channel activity · PaperHive',
          })
          .segment('bookmarks', {
            template:
              `<channel-bookmarks-list
                bookmarks="$ctrl.bookmarks"
                channel="$ctrl.channel"
              ></channel-bookmarks-list>`,
            title: 'Channel bookmarks · PaperHive',
          })
          .segment('invitations', {
            template:
              `<channel-invitations
                channel="$ctrl.channel"
                is-owner="$ctrl.isOwner"
              ></channel-invitations>`,
            title: 'Channel invitations · PaperHive',
          })
          .segment('members', {
            template:
              `<channel-members
                channel="$ctrl.channel"
                is-owner="$ctrl.isOwner"
              ></channel-members>`,
            title: 'Channel members · PaperHive',
          })
          .segment('settings', {
            template:
              `<channel-settings
                channel="$ctrl.channel"
                is-owner="$ctrl.isOwner"
              ></channel-settings>`,
            title: 'Channel settings · PaperHive',
          })
        .up()

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

        .segment('documents', {
          template: '<document></document>',
          dependencies: ['documentId'],
          title: 'Document · PaperHive',
        })
        .within()
          .segment('activity', {
            template: `
              <div class="container-fluid">
                <div class="row">
                  <div class="col-md-9 col-md-offset-3">
                    <activity
                      filter-mode="document"
                      filter-id="$ctrl.documentCtrl.documentId"
                    ></activity>
                  </div>
                </div>
              </div>
            `,
            title: 'Activity · PaperHive'
          })
          .segment('hivers', {
            template: `
              <div class="container-fluid">
                <div class="row">
                  <div class="col-md-9 col-md-offset-3">
                    <hivers hivers="$ctrl.documentCtrl.hivers"></hivers>
                  </div>
                </div>
              </div>
            `,
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
          title: 'Add a new document · PaperHive'
        })
        .segment('documents_remote', {
          template: '<document-remote></document-remote>',
          title: 'Document remote redirect · PaperHive'
        })

        .segment('helpMarkdown', {
          template: '<help-markdown></help-markdown>',
          title: 'Markdown cheat sheet',
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

        .segment('partners', {
          template:
            `<div class="container ph-xl-margin-bottom">
              <h2>Partners</h2>
              <partner-logos></partner-logos>
              <h2>Supporters</h2>
              <supporter-logos></supporter-logos>
            </div>`,
          title: 'Partners and supporters · PaperHive',
          meta: [
            {
              name: 'description',
              content: 'Partners and supporters'
            }
          ]
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
          title: 'PaperHive for publishers and repositories · Paperhive'
        })

        .segment('search', {
          template: '<search-results></search-results>',
          title: 'Search results',
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

        .segment('terms', {
          template: '<terms></terms>',
          title: 'Terms and privacy policy · PaperHive',
          meta: [
            {
              name: 'description',
              content: 'Terms and privacy policy'
            }
          ]
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
            template:
              `<activity
                filter-mode="person"
                filter-id="user.id"
              ></activity>`
          })
        .up()
        ;

      $routeProvider.otherwise({redirectTo: '/404'});
    }
  ]);
};
