import * as _ from 'lodash';
import paperhiveSources from 'paperhive-sources';

export default function(app) {

  app.controller('ArticleTextCtrl', [
    '$scope', '$route', '$routeSegment', '$document', '$http', '$filter',
    'config', 'authService', 'notificationService', 'distangleService',
    'metaService',
    function(
      $scope, $route, $routeSegment, $document, $http, $filter, config,
      authService, notificationService, distangleService, metaService
    ) {
      $scope.text = {
        highlightInfos: {},
        highlightBorder: {},
        marginDiscussionSizes: {},
        marginOffsets: {}
      };

      const revisionId = $routeSegment.$routeParams.revisionId;

      $scope.$watch('revisions', function(revisions) {
        if (!revisions) { return; }
        let activeRevisionIdx;
        if (revisionId) {
          activeRevisionIdx = _.findIndex(revisions, {revision: revisionId});
          if (activeRevisionIdx === -1) {
            notificationService.notifications.push({
              type: 'error',
              message: `Unknown revision ID ${revisionId}.`
            });
          }
        } else {
          // default to the latest OA revision
          activeRevisionIdx = $scope.latestOAIdx;
        }
        // Expose in scope
        $scope.activeRevisionIdx = activeRevisionIdx;
        // Construct strings for display in revision selection dropdown.
        // get pdf url
        try {
          $scope.pdfSource = paperhiveSources({ apiUrl: config.apiUrl })
            .getAccessiblePdfUrl(revisions[activeRevisionIdx]);
        } catch (e) {
          notificationService.notifications.push({
            type: 'error',
            message: 'PDF cannot be displayed: ' + e.message
          });
        }
      });

      $scope.getShortDescription = (revision) => {
        const desc = [];
        if (revision.journal && revision.journal.nameShort) {
          desc.push(revision.journal.nameShort);
        } else if (revision.journal && revision.journal.nameLong) {
          desc.push(revision.journal.nameLong.substring(0, 20));
        } else {
          if (revision.remote.type === 'arxiv') {
            // For arXiv, concatenate the remote name and the version
            // without comma.
            desc.push('arXiv ' + revision.remote.revision);
          } else {
            desc.push(revision.remote.type);
            desc.push(revision.remote.revision);
          }
        }
        if (revision.publishedAt) {
          desc.push($filter('date')(revision.publishedAt, 'MMM yyyy'));
        }
        return desc.join(', ');
      };

      $scope.addDiscussion = function(comment) {
        const disc = _.cloneDeep(_.pick(
          comment, ['title', 'body', 'target', 'tags']
        ));

        const activeRevision = $scope.revisions[$scope.activeRevisionIdx];
        disc.target.document = activeRevision.id;
        disc.target.documentRevision = activeRevision.revision;

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

      // set meta data
      $scope.$watchGroup(['article', 'discussions.stored'], function(newVals) {
        const article = newVals[0];
        const discussions = newVals[1];
        if (article) {
          let description;
          if (discussions.length === 1) {
            description =  'Article with 1 discussion.';
          } else if (discussions.length > 1) {
            description = 'Article with ' + discussions.length +
              ' discussions.';
          } else {
            description = 'Article with discussions.';
          }
          description +=
              (article.authors.length === 1 ? ' Author: ' : ' Authors: ') +
              article.authors.join(', ') + '.';

          const meta = [
            {name: 'description', content: description},
            {name: 'author', content: article.authors.join(', ')}
          ];
          $scope.addArticleMetaData(meta);

          metaService.set({
            title: article.title + ' · PaperHive',
            meta: meta
          });
        }
      });

      // compute offsets of margin discussions ('boingidi')
      const updateOffsets = function() {
        const draftTop = $scope.originalComment.draft.target &&
          $scope.text.highlightInfos.draft &&
          $scope.text.highlightInfos.draft.top;
        const draftHeight = draftTop &&
          $scope.text.marginDiscussionSizes.draft &&
          $scope.text.marginDiscussionSizes.draft.height;
        const showDraft = draftTop !== undefined && draftHeight;

        const offsets = _.sortBy(_.compact(_.map(
          $scope.text.highlightInfos,
          function(val, key) {
            const height = $scope.text.marginDiscussionSizes[key] &&
              $scope.text.marginDiscussionSizes[key].height;
            return (key !== 'draft' && val.top !== undefined &&
                    height !==  undefined) ?
                    {id: key, top: val.top, height: height} : undefined;
          })), 'top');

        // padding between elements
        const padding = 8;
        // const ids = _.map(offsets, 'id');
        // const anchors = _.map(offsets, 'top');
        // const heights = _.map(_.map(offsets, 'height'), function(height) {
        //   return height + padding;
        // });
        // const optOffsets = distangleService.distangle(
        //   anchors, heights, 0
        // );

        // result
        const marginOffsets = {
          draft: undefined,
        };

        // place draft
        if (showDraft) {
          marginOffsets.draft = draftTop;
        }

        // treat above and below separately
        const offsetsAbove = _.filter(offsets, function(offset) {
          return showDraft && offset.top <= draftTop;
        });
        const offsetsBelow = _.filter(offsets, function(offset) {
          return !showDraft || offset.top > draftTop;
        });

        // move bottom elements from above to below if there's not enough space
        const getTotalHeight = function(offsets) {
          return _.sum(_.map(offsets, 'height')) + offsets.length * padding;
        };
        while (showDraft && getTotalHeight(offsetsAbove) > draftTop) {
          // remove last one in above
          const last = offsetsAbove.splice(-1, 1);
          // insert to beginning of below
          offsetsBelow.unshift(last[0]);
        }

        const place = function(offsets, lb, ub) {
          const ids = _.map(offsets, 'id');
          const anchors = _.map(offsets, 'top');
          const heights = _.map(_.map(offsets, 'height'), function(height) {
            return height + padding;
          });
          const optOffsets = distangleService.distangle(anchors, heights, lb, ub);
          let i;
          for (i = 0; i < anchors.length; i++) {
            marginOffsets[ids[i]] = optOffsets[i];
          }

        };

        if (showDraft) {
          place(offsetsAbove, 0, draftTop);
          place(offsetsBelow, draftTop + draftHeight + padding, undefined);
        } else {
          place(offsetsBelow, 0, undefined);
        }

        $scope.text.marginOffsets = marginOffsets;
        return;
      };
      $scope.$watch('text.highlightInfos', updateOffsets, true);
      $scope.$watch('text.marginDiscussionSizes', updateOffsets, true);
    }
  ]);
};
