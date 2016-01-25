'use strict';
var _ = require('lodash');
var angular = require('angular');
var moment = require('moment');

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
          '/documents/' + $routeSegment.$routeParams.articleId
      )
      .success(function(article) {
        $scope.article = article;

        $http.get(
          config.apiUrl +
            '/documents/' + $routeSegment.$routeParams.articleId + '/pdf'
        )
        .success(function(url) {
          $scope.pdfSource = url;
        })
        .error(function(data) {
          notificationService.notifications.push({
            type: 'error',
            message: data.message ? data.message : 'could not fetch PDF of article ' +
              '(unknown reason)'
          });
        });

        // Cut description down to 150 chars, cf.
        // <http://moz.com/learn/seo/meta-description>
        // TODO move linebreak removal to backend?
        var metaData = [
          {
            name: 'description',
            content: article.title + ' by ' + article.authors.join(', ') + '.'
          },
          {name: 'author', content: article.authors.join(', ')},
          {name: 'keywords', content: article.tags.join(', ')}
        ];

        $scope.addArticleMetaData(metaData);

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
          '/documents/' + $routeSegment.$routeParams.articleId + '/discussions'
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
          console.warning(
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
          content: moment($scope.article.publishedAt).format('YYYY/MM/DD')
        });
        // Don't expose the DOI for all versions of the article; it really only
        // identifies one version, usually not the arXiv one, but an upstream
        // version.
        if ($scope.pdfSource) {
          metaData.push({name: 'citation_pdf_url', content: $scope.pdfSource});
        }
      };

      $scope.purgeDraft = function() {
        $scope.originalComment.draft = {};
      };

      $scope.addDiscussion = function(comment) {
        var disc = _.cloneDeep(_.pick(
          comment, ['title', 'body', 'target', 'tags']
        ));

        disc.target.document = $routeSegment.$routeParams.articleId;
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
        var disc = _.cloneDeep(_.pick(
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
        return $http.delete(
          config.apiUrl +
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
