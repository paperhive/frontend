'use strict';
var _ = require('lodash');
var angular = require('angular');

module.exports = function(app) {

  app.controller('ArticleCtrl', [
    '$scope', '$route', '$routeSegment', '$document', '$http', 'config',
    '$rootScope', 'authService', 'notificationService', 'metaService',
    function(
      $scope, $route, $routeSegment, $document, $http, config, $rootScope,
      authService, notificationService, metaService
    ) {
      // expose authService
      $scope.auth = authService;
      // Expose the routeSegment to be able to determine the active tab in the
      // template.
      $scope.$routeSegment = $routeSegment;

      // fetch article
      $http.get(
        config.apiUrl +
          '/articles/' + $routeSegment.$routeParams.articleId
      )
      .success(function(article) {
        $scope.article = article;

        if (article.source.type === 'arxiv') {
          $scope.pdfSource =
            'http://arxiv.org/pdf/' + article.source.id + '.pdf';
        }

        // Cut description down to 150 chars, cf.
        // <http://moz.com/learn/seo/meta-description>
        // TODO move linebreak removal to backend?
        var metaData = [
          {
            name: 'description',
            content: article.title + ' by ' + article.authors.join(', ') + '.',
          },
          {name: 'author', content: article.authors.join(', ')},
          {name: 'keywords', content: article.tags.join(', ')}
        ];

        $scope.addMetaData(metaData);

        metaService.set({
          title: article.title + ' · PaperHive',
          meta: metaData
        });
      })
      .error(function(data) {
        notificationService.notifications.push({
          type: 'error',
          message: data.message ? data.message : 'could not fetch article ' +
            '(unknown reason)'
        });
      });

      $http.get(
        config.apiUrl +
          '/articles/' + $routeSegment.$routeParams.articleId + '/discussions'
      )
      .success(function(discussions) {
        $scope.discussions.stored = discussions;
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
        // Add some Highwire Press tags, used by Google Scholar, arXiv etc.; cf.
        // <http://webmasters.stackexchange.com/a/13345/15250>.
        // TODO add some more, if possible (citation_journal etc)
        metaData.push({name: 'citation_title', content: $scope.article.title});
        $scope.article.authors.forEach(function(author) {
          metaData.push({name: 'citation_author', content: author});
        });
        // TODO which date to add here? publication on arxiv? of which version?
        metaData.push({
          name: 'citation_date',
          content: $scope.article.publishedAt
        });
        var doi = _.result(_.find($scope.article.links, {type: 'doi'}), 'id');
        if (doi) {
          metaData.push({name: 'citation_doi',  content: doi});
        }
        if ($scope.pdfSource) {
          metaData.push({name: 'citation_pdf_url', content: $scope.pdfSource});
        }
      };

      $scope.purgeDraft = function() {
        $scope.originalComment.draft = {};
      };

      $scope.addDiscussion = function(comment) {
        var originalComment = _.cloneDeep(_.pick(
          comment, ['title', 'body', 'target', 'tags']
        ));

        $scope.submitting = true;
        return $http.post(
          config.apiUrl +
            '/articles/' + $routeSegment.$routeParams.articleId +
            '/discussions',
          {originalAnnotation: originalComment}
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
        var originalComment = _.cloneDeep(_.pick(
          comment, ['title', 'body', 'target', 'tags']
        ));

        return $http.put(
          config.apiUrl +
            '/articles/' + $routeSegment.$routeParams.articleId +
            '/discussions/' + discussion.index,
          {originalAnnotation: originalComment}
        )
        .success(function(newDiscussion) {
          angular.copy(newDiscussion, discussion);
        })
          .error(notificationService.httpError('could not update discussion'));
      };

      $scope.discussionDelete = function(discussion) {
        return $http.delete(
          config.apiUrl +
            '/articles/' + $routeSegment.$routeParams.articleId +
            '/discussions/' + discussion.index
        )
        .success(function() {
          _.remove($scope.discussions.stored, {index: discussion.index});
        })
          .error(notificationService.httpError('could not delete discussion'));
      };

      $scope.replyAdd = function(discussion, reply) {
        reply = _.cloneDeep(_.pick(
          reply, ['body']
        ));
        return $http.post(
          config.apiUrl +
            '/articles/' + $routeSegment.$routeParams.articleId +
            '/discussions/' + discussion.index +
            '/replies',
          reply
        )
        .success(function(reply) {
          discussion.replies.push(reply);
        })
          .error(notificationService.httpError('could not add reply'));
      };

      $scope.replyUpdate = function(discussion, replyOld, replyNew) {
        var replyId = replyOld._id;
        replyNew = _.cloneDeep(_.pick(
          replyNew, ['body']
        ));
        return $http.put(
          config.apiUrl +
            '/articles/' + $routeSegment.$routeParams.articleId +
            '/discussions/' + discussion.index +
            '/replies/' + replyId,
          replyNew
        )
        .success(function(reply) {
          angular.copy(reply, replyOld);
        })
          .error(notificationService.httpError('could not add reply'));
      };

      $scope.replyDelete = function(discussion, replyId) {
        return $http.delete(
          config.apiUrl +
            '/articles/' + $routeSegment.$routeParams.articleId +
            '/discussions/' + discussion.index +
            '/replies/' + replyId
        )
        .success(function(data) {
          _.remove(discussion.replies, {_id: replyId});
        })
        .error(notificationService.httpError('could not delete reply'));
      };

    }]);
};
