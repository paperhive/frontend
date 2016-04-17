import * as _ from 'lodash';
import * as angular from 'angular';
import { cloneDeep, find, findLastIndex, pick, remove, some } from 'lodash';

import template from './template.html!text';

export default function(app) {
  app.component(
    'document', {
      template,
      controller: [
        '$scope', '$route', '$routeSegment', '$document', '$http', 'config',
        '$rootScope', '$filter', 'authService', 'notificationService',
        'metaService', 'websocketService', '$window', 'tourService',
        function(
          $scope, $route, $routeSegment, $document, $http, config, $rootScope,
          $filter, authService, notificationService, metaService, websocketService,
          $window, tourService
        ) {
          // expose authService
          $scope.auth = authService;
          // Expose the routeSegment to be able to determine the active tab in the
          // template.
          $scope.$routeSegment = $routeSegment;

          $scope.tour = tourService;

          const documentId = $routeSegment.$routeParams.documentId;
          $scope.documentId = documentId;

          const documentUpdates = websocketService.join('documents', documentId);
          const documentUpdatesSubscriber = documentUpdates.subscribe((update) => {
            $scope.$apply(() => {
              if (update.resource === 'discussion') {
                switch (update.method) {
                  case 'post':
                    if (find($scope.discussions.stored, {id: update.data.id})) {
                      return;
                    }
                    $scope.discussions.stored.push(update.data);
                    break;
                  case 'put':
                    const discussion = find($scope.discussions.stored, {id: update.data.id});
                    if (!discussion) {
                      notificationService.notifications.push({
                        type: 'error',
                        message: 'could not find discussion for update'
                      });
                      return;
                    }
                    angular.copy(update.data, discussion);
                    break;
                  case 'delete':
                    const len = $scope.discussions.stored.length;
                    remove($scope.discussions.stored, {id: update.data.id});
                    if (len === $scope.discussions.stored.length) {
                      notificationService.notifications.push({
                        type: 'error',
                        message: 'could not find discussion for removal'
                      });
                      return;
                    }
                    break;
                }
              }
              if (update.resource === 'reply') {
                const discussion = find($scope.discussions.stored, {id: update.data.discussion});
                if (!discussion) {
                  notificationService.notifications.push({
                    type: 'error',
                    message: 'could not find discussion'
                  });
                  return;
                }
                switch (update.method) {
                  case 'post':
                    if (find(discussion.replies, {id: update.data.id})) {
                      return;
                    }
                    discussion.replies.push(update.data);
                    break;
                  case 'put':
                    const reply = find(discussion.replies, {id: update.data.id});
                    if (!reply) {
                      notificationService.notifications.push({
                        type: 'error',
                        message: 'could not find reply for update'
                      });
                      return;
                    }
                    angular.copy(update.data, reply);
                    break;
                  case 'delete':
                    const len = discussion.replies.length;
                    remove(discussion.replies, {id: update.data.id});
                    if (len === discussion.replies.length) {
                      notificationService.notifications.push({
                        type: 'error',
                        message: 'could not find discussion for removal'
                      });
                      return;
                    }
                    break;
                }
              }
            });
          });

          $scope.$on('$destroy', () => documentUpdatesSubscriber.dispose());

          // fetch document
          $http.get(
            config.apiUrl +
              `/documents/${documentId}/revisions/`
          )
            .success(ret => {
              $scope.revisions = ret.revisions;
              $scope.latestOAIdx = findLastIndex(ret.revisions, {isOpenAccess: true});

              const latestOARevision = $scope.revisions[$scope.latestOAIdx];
              // Cut description down to 150 chars, cf.
              // <http://moz.com/learn/seo/meta-description>
              // TODO move linebreak removal to backend?
              const metaData = [
                {
                  name: 'description',
                  content: latestOARevision.title + ' by ' + latestOARevision.authors.join(', ') + '.'
                },
                {name: 'author', content: latestOARevision.authors.join(', ')},
                {name: 'keywords', content: latestOARevision.tags.join(', ')}
              ];

              $scope.addDocumentMetaData(metaData);

              metaService.set({
                title: latestOARevision.title + ' · PaperHive',
                meta: metaData
              });
            })
            .error(data => {
              notificationService.notifications.push({
                type: 'error',
                message: data.message ? data.message :
                  'could not fetch document (unknown reason)'
              });
            });

          $http.get(
            config.apiUrl +
              `/documents/${documentId}/discussions`
          )
            .success(ret => $scope.discussions.stored = ret.discussions)
            .error(data => {
              notificationService.notifications.push({
                type: 'error',
                message: data.message ? data.message :
                  'could not fetch discussions (unknown reason)'
              });
            });

          $scope.originalComment = {
            draft: {}
          };
          $scope.discussions = {
            stored: []
          };

          // pdf data
          $scope.pdf = {};

          $scope.addDocumentMetaData = metaData => {
            if (!$scope.document) {
              console.warn(
                'Tried to set document meta data, but data isn\'t present.'
              );
              return;
            }
            // Add some Highwire Press tags, used by Google Scholar, arXiv etc.; cf.
            // <http://webmasters.stackexchange.com/a/13345/15250>.
            // TODO add some more, if possible (citation_journal etc)
            // Check out
            // <https://scholar.google.com/intl/en/scholar/inclusion.html#indexing>
            // for more info.
            metaData.push({name: 'citation_title', content: $scope.document.title});
            // Both "John Smith" and "Smith, John" are fine.
            $scope.document.authors.forEach(author => {
              metaData.push({name: 'citation_author', content: author});
            });
            // citation_publication_date: REQUIRED for Google Scholar.
            metaData.push({
              name: 'citation_publication_date',
              content: $filter('date')($scope.document.publishedAt, 'yyyy/MM/dd')
            });
            // Don't expose the DOI for all versions of the document; it really only
            // identifies one version, usually not the arXiv one, but an upstream
            // version.
            // if ($scope.pdfSource) {
            //   metaData.push({name: 'citation_pdf_url', content: $scope.pdfSource});
            // }
          };

          $scope.discussionSubmit = (_discussion, revision) => {
            const discussion = cloneDeep(_discussion);

            // insert document id and revision
            discussion.target.document = revision.id;
            discussion.target.documentRevision = revision.revision;

            return $http.post(config.apiUrl + '/discussions', discussion)
              .success(newDiscussion => {
                if (find($scope.discussions.stored, {id: newDiscussion.id})) return;
                $scope.discussions.stored.push(newDiscussion);
              })
              .error(notificationService.httpError('could not add discussion'));
          };

          $scope.discussionUpdate = _discussion => {
            const discussion =
              pick(_discussion, 'title', 'body', 'target', 'tags');

            return $http.put(
              config.apiUrl + '/discussions/' + _discussion.id, discussion
            )
              .success(updatedDiscussion => {
                // overwrite existing discussion
                const existingDiscussion =
                  find($scope.discussions.stored, {id: _discussion.id});
                if (!existingDiscussion) {
                  notificationService.notifications.push({
                    type: 'error',
                    message: 'Existing discussion not found',
                  });
                  return;
                }
                angular.copy(updatedDiscussion, existingDiscussion);
              })
              .error(notificationService.httpError('could not update discussion'));
          };

          $scope.discussionDelete = discussion => {
            return $http({
              url: config.apiUrl +  '/discussions/' + discussion.id,
              method: 'DELETE',
              headers: {'If-Match': '"' + discussion.revision + '"'}
            })
            .success(() => remove($scope.discussions.stored, {id: discussion.id}))
            .error(notificationService.httpError('could not delete discussion'));
          };

          $scope.replySubmit = (discussion, _reply) => {
            const reply = pick(_reply, 'body');
            reply.discussion = discussion.id;
            return $http.post(config.apiUrl + '/replies', reply)
              .success(newReply => {
                if (find(discussion.replies, {id: newReply.id})) return;
                discussion.replies.push(newReply);
              })
              .error(notificationService.httpError('could not add reply'));
          };

          $scope.replyUpdate = (discussion, _reply) => {
            const reply = pick(_reply, 'body');
            return $http({
              url: config.apiUrl + '/replies/' + _reply.id,
              method: 'PUT',
              data: reply,
              headers: {'If-Match': `"${_reply.revision}"`}
            })
              .success(updatedReply => {
                const existingReply = find(discussion.replies, {id: _reply.id});
                if (!existingReply) {
                  notificationService.notifications.push({
                    type: 'error',
                    message: 'Existing reply not found',
                  });
                  return;
                }
                angular.copy(updatedReply, existingReply);
              })
              .error(notificationService.httpError('could not update reply'));
          };

          $scope.replyDelete = (discussion, reply) => {
            return $http({
              url: config.apiUrl + '/replies/' + reply.id,
              method: 'DELETE',
              headers: {'If-Match': '"' + reply.revision + '"'}
            })
              .success(() => remove(discussion.replies, {id: reply.id}))
              .error(notificationService.httpError('could not delete reply'));
          };

        }]
    });
};
