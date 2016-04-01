import * as _ from 'lodash';
import { find } from 'lodash';
import * as urlPackage from 'url';

export default function(app) {

  app.controller('DocumentTextCtrl', [
    '$scope', '$route', '$routeSegment', '$document', '$http', '$filter', '$timeout',
    'config', 'authService', 'notificationService', 'distangleService',
    'metaService', 'tourService', 'smoothScroll', '$location',
    function(
      $scope, $route, $routeSegment, $document, $http, $filter, $timeout, config,
      authService, notificationService, distangleService, metaService, tourService,
      smoothScroll, $location
    ) {
      $scope.tour = tourService;

      $scope.text = {
        highlightInfos: {},
        highlightBorder: {},
        marginDiscussionSizes: {},
        marginOffsets: {}
      };

      $scope.discussionTour = {};
      $scope.$watch('discussionTour.rendered && tour.stages[tour.index] === "margin-discussion"', (shouldScroll) => {
        if (shouldScroll) {
          // wait until popover is rendered
          $timeout(() => {
            const popover = document.getElementById('discussionTourPopover');
            smoothScroll(popover, {offset: 140});
          });
        }
      });

      const revisionId = $routeSegment.$routeParams.revisionId;

      function getPdfUrl(documentRevision) {
        if (documentRevision.file.hasCors &&
            urlPackage.parse(documentRevision.file.url).protocol === 'https') {
          // all good
          return documentRevision.file;
        }
        // No HTTPS/Cors? PaperHive can proxy the document if it's open access.
        if (documentRevision.isOpenAccess) {
          return config.apiUrl + '/proxy?url=' +
            encodeURIComponent(documentRevision.file.url);
        }
        notificationService.notifications.push({
          type: 'error',
          message: 'The publisher makes the PDF available only through an insecure connection.'
        });
      }

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
          // Default to the latest OA revision, and -- if that's not available
          // -- the latest revision.
          activeRevisionIdx =
            $scope.latestOAIdx !== -1 ? $scope.latestOAIdx : revisions.length - 1;
        }
        // Expose in scope
        $scope.activeRevisionIdx = activeRevisionIdx;
        // Construct strings for display in revision selection dropdown.
        // get pdf url
        const revision = revisions[activeRevisionIdx];
        $scope.origPdfSource = revision.file.url;

        // TODO actually check user access here (e.g., via the Elsevier Article
        // Entitlement API)
        const userHasAccess = revision.isOpenAccess;
        if (userHasAccess) {
          $scope.pdfSource = getPdfUrl(revision);
        } else {
          if ($scope.latestOAIdx !== -1) {
            // redirect to latest OA version
            const latestOaRevision = revisions[$scope.latestOAIdx];
            $location.path(
              `/documents/${latestOaRevision.id}/revisions/${latestOaRevision.revision}`
            );
            // TODO display a notification about the redirect?
          } else {
            notificationService.notifications.push({
              type: 'error',
              message: 'You currently have no access to the PDF.',
            });
          }
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
          } else if (revision.isbn) {
            desc.push(`ISBN ${revision.isbn}`);
          } else {
            desc.push(revision.remote.type);
            if (revision.remote.revision) {
              desc.push(revision.remote.revision);
            } else {
              desc.push(revision.remote.id);
            }
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
          if (!find($scope.discussions.stored, {id: discussion.id})) {
            $scope.discussions.stored.push(discussion);
          }
          $scope.purgeDraft();
        })
        .error(function(data) {
          $scope.submitting = false;
        })
          .error(notificationService.httpError('could not add discussion'));
      };

      // set meta data
      $scope.$watchGroup(['document', 'discussions.stored'], function(newVals) {
        const document = newVals[0];
        const discussions = newVals[1];
        if (document) {
          let description;
          if (discussions.length === 1) {
            description =  'Document with 1 discussion.';
          } else if (discussions.length > 1) {
            description = 'Document with ' + discussions.length +
              ' discussions.';
          } else {
            description = 'Document with discussions.';
          }
          description +=
              (document.authors.length === 1 ? ' Author: ' : ' Authors: ') +
              document.authors.join(', ') + '.';

          const meta = [
            {name: 'description', content: description},
            {name: 'author', content: document.authors.join(', ')}
          ];
          $scope.addDocumentMetaData(meta);

          metaService.set({
            title: document.title + ' · PaperHive',
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
