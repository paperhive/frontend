import * as _ from 'lodash';
import * as angular from 'angular';
import {findLastIndex, some} from 'lodash';

export default function(app) {

  app.controller('ArticleCtrl', [
    '$scope', '$route', '$routeSegment', '$document', '$http', 'config',
    '$rootScope', '$filter', 'authService', 'notificationService',
    'metaService',
    function(
      $scope, $route, $routeSegment, $document, $http, config, $rootScope,
      $filter, authService, notificationService, metaService
    ) {
      // expose authService
      $scope.auth = authService;
      // Expose the routeSegment to be able to determine the active tab in the
      // template.
      $scope.$routeSegment = $routeSegment;

      const articleId = $routeSegment.$routeParams.articleId;

      // fetch article
      $http.get(
        config.apiUrl +
          `/documents/${articleId}/revisions/`
      )
      .success(function(ret) {
        console.log('ret', ret);
        $scope.revisions = ret.revisions;
        $scope.latestOAIdx = findLastIndex(ret.revisions, {openAccess: true});

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

        $scope.addArticleMetaData(metaData);

        metaService.set({
          title: latestOARevision.title + ' · PaperHive',
          meta: metaData
        });
      })
      .error(function(data) {
        notificationService.notifications.push({
          type: 'error',
          message: data.message ? data.message :
            'could not fetch article (unknown reason)'
        });
      });

      $http.get(
        config.apiUrl +
          `/documents/${articleId}/discussions`
      )
      .success(function(ret) {
        $scope.discussions.stored = ret.discussions;
      })
      .error(function(data) {
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

      $scope.addArticleMetaData = function(metaData) {
        if (!$scope.article) {
          console.warn(
            'Tried to set article meta data, but data isn\'t present.'
          );
          return;
        }
        // Add some Highwire Press tags, used by Google Scholar, arXiv etc.; cf.
        // <http://webmasters.stackexchange.com/a/13345/15250>.
        // TODO add some more, if possible (citation_journal etc)
        // Check out
        // <https://scholar.google.com/intl/en/scholar/inclusion.html#indexing>
        // for more info.
        metaData.push({name: 'citation_title', content: $scope.article.title});
        // Both "John Smith" and "Smith, John" are fine.
        $scope.article.authors.forEach(function(author) {
          metaData.push({name: 'citation_author', content: author});
        });
        // citation_publication_date: REQUIRED for Google Scholar.
        metaData.push({
          name: 'citation_publication_date',
          content: $filter('date')($scope.article.publishedAt, 'yyyy/MM/dd')
        });
        // Don't expose the DOI for all versions of the article; it really only
        // identifies one version, usually not the arXiv one, but an upstream
        // version.
        // if ($scope.pdfSource) {
        //   metaData.push({name: 'citation_pdf_url', content: $scope.pdfSource});
        // }
      };

      $scope.purgeDraft = function() {
        $scope.originalComment.draft = {};
      };

      $scope.addDiscussion = function(comment) {
        const disc = _.cloneDeep(_.pick(
          comment, ['title', 'body', 'target', 'tags']
        ));

        disc.target.document = articleId;
        disc.target.documentRevision = $scope.article.revision;

        $scope.submitting = true;
        return $http.post(
          config.apiUrl + '/discussions',
          disc
        )
        .success(function(discussion) {
          $scope.submitting = false;
          $scope.discussions.stored.push(discussion);
          $scope.purgeDraft();
        })
        .error(function(data) {
          $scope.submitting = false;
        })
          .error(notificationService.httpError('could not add discussion'));
      };

      $scope.originalUpdate = function(discussion, comment) {
        const disc = _.cloneDeep(_.pick(
          comment, ['title', 'body', 'target', 'tags']
        ));

        return $http.put(
          config.apiUrl + '/discussions/' + discussion.id,
          disc
        )
        .success(function(newDiscussion) {
          angular.copy(newDiscussion, discussion);
        })
          .error(notificationService.httpError('could not update discussion'));
      };

      $scope.discussionDelete = function(discussion) {
        return $http({
          url: config.apiUrl +  '/discussions/' + discussion.id,
          method: 'DELETE',
          headers: {'If-Match': '"' + discussion.revision + '"'}
        })
        .success(function() {
          _.remove($scope.discussions.stored, {id: discussion.id});
        })
          .error(notificationService.httpError('could not delete discussion'));
      };

      $scope.replyAdd = function(discussion, reply) {
        reply = _.cloneDeep(_.pick(
          reply, ['body']
        ));
        reply.discussion = discussion.id;
        return $http.post(
          config.apiUrl + '/replies',
          reply
        )
        .success(function(reply) {
          discussion.replies.push(reply);
        })
          .error(notificationService.httpError('could not add reply'));
      };

      $scope.replyUpdate = function(discussion, replyOld, replyNew) {
        const replyId = replyOld.id;
        return $http({
          url: config.apiUrl + '/replies/' + replyId,
          method: 'PUT',
          data: {body: replyNew.body},
          headers: {'If-Match': '"' + replyOld.revision + '"'}
        })
        .success(function(reply) {
          angular.copy(reply, replyOld);
        })
          .error(notificationService.httpError('could not add reply'));
      };

      $scope.replyDelete = function(discussion, reply) {
        return $http({
          url: config.apiUrl + '/replies/' + reply.id,
          method: 'DELETE',
          headers: {'If-Match': '"' + reply.revision + '"'}
        })
        .success(function(data) {
          _.remove(discussion.replies, {id: reply.id});
        })
        .error(notificationService.httpError('could not delete reply'));
      };

    }]);
};
