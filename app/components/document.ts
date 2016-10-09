import * as _ from 'lodash';
import * as angular from 'angular';
import { cloneDeep, find, findLastIndex, merge, orderBy, pick, remove, some } from 'lodash';

import template from './document.html';
import { getRevisionMetadata } from '../utils/documents';

class DiscussionsController {
  // dependencies
  config: any;
  $scope: any;
  $http: any;
  websocketService: any;

  // data
  document: string;
  discussions: Array<any>;

  constructor(document: string, config: any, $scope: any, $http: any, websocketService) {
    this.config = config;
    this.$scope = $scope;
    this.$http = $http;
    this.websocketService = websocketService;

    this.document = document;
    this.discussions = [];
  }

  async init() {
    const response = await this.$http({
      url: `${this.config.apiUrl}/documents/${this.document}/discussions`,
    });
    this.discussions = response.data.discussions;
    this.websocketInit();
  }

  async discussionSubmit(discussion) {
    const response = await this.$http({
      url: `${this.config.apiUrl}/discussions`,
      method: 'POST',
      data: discussion,
    });
    this._discussionCreate(response.data);
    return response.data;
  }

  async discussionUpdate(discussion) {
    const _discussion = pick(discussion, 'title', 'body', 'target', 'tags');
    const response = await this.$http({
      url: `${this.config.apiUrl}/discussions/${discussion.id}`,
      method: 'PUT',
      data: _discussion,
    });
    this._discussionUpdate(response.data);
    return response.data;
  }

  async discussionDelete(discussion) {
    const response = await this.$http({
      url: `${this.config.apiUrl}/discussions/${discussion.id}`,
      method: 'DELETE',
      headers: {'If-Match': `"${discussion.revision}"`},
    });
    this._discussionDelete(discussion);
  }

  async replySubmit(reply) {
    const response = await this.$http({
      url: `${this.config.apiUrl}/replies`,
      method: 'POST',
      data: reply,
    });
    this._replyCreate(response.data);
    return response.data;
  }

  async replyUpdate(reply) {
    const _reply = pick(reply, 'body');
    const response = await this.$http({
      url: `${this.config.apiUrl}/replies/${reply.id}`,
      method: 'PUT',
      data: _reply,
      headers: {'If-Match': `"${reply.revision}"`},
    });
    this._replyUpdate(response.data);
    return response.data;
  }

  async replyDelete(reply) {
    const response = await this.$http({
      url: `${this.config.apiUrl}/replies/${reply.id}`,
      method: 'DELETE',
      headers: {'If-Match': `"${reply.revision}"`},
    });
    this._replyDelete(merge(
      {},
      reply,
      {discussionRevision: response.data.discussionRevision}
    ));
  }

  // subscribe to push notifications
  websocketInit() {
    const documentUpdates = this.websocketService.join('documents', this.document);
    const documentUpdatesSubscriber = documentUpdates.subscribe((update) => {
      const data = update.data;
      this.$scope.$apply(() => {
        switch (update.resource) {
          case 'discussion':
            switch (update.method) {
              case 'post': this._discussionCreate(data); break;
              case 'put': this._discussionUpdate(data); break;
              case 'delete': this._discussionDelete(data); break;
            }
            break;
          case 'reply':
            switch (update.method) {
              case 'post': this._replyCreate(data); break;
              case 'put': this._replyUpdate(data); break;
              case 'delete': this._replyDelete(data); break;
            }
            break;
        }
      });
    });

    // dispose websocket subscription when scope is destroyed
    this.$scope.$on('$destroy', () => documentUpdatesSubscriber.dispose());
  }

  _discussionGet(discussionId) {
    const discussion = find(this.discussions, {id: discussionId});
    if (!discussion) {
      throw new Error(`Could not find discussion ${discussionId}.`);
    }
    return discussion;
  }

  _discussionCreate(newDiscussion) {
    const existingDiscussion = find(this.discussions, {id: newDiscussion.id});
    if (existingDiscussion) {
      if (existingDiscussion.revision !== newDiscussion.revision) {
        throw new Error('Two discussions created with same id but different revision.');
      }
      return;
    }
    this.discussions.push(newDiscussion);
  }

  _discussionUpdate(updatedDiscussion) {
    const existingDiscussion = find(this.discussions, {id: updatedDiscussion.id});
    if (!existingDiscussion) {
      throw new Error('Could not find discussion for updating.');
    }
    angular.copy(updatedDiscussion, existingDiscussion);
  }

  _discussionDelete(deletedDiscussion) {
    remove(this.discussions, {id: deletedDiscussion.id});
  }

  _replyCreate(newReply) {
    const discussion = this._discussionGet(newReply.discussion);
    const existingReply = find(discussion.replies, {id: newReply.id});
    if (existingReply) {
      if (existingReply.revision !== newReply.revision) {
        throw new Error('Two replies created with same id but different revision.');
      }
      return;
    }
    discussion.replies.push(newReply);
    discussion.revision = newReply.discussionRevision;
  }

  _replyUpdate(updatedReply) {
    const discussion = this._discussionGet(updatedReply.discussion);
    const existingReply = find(discussion.replies, {id: updatedReply.id});
    if (!existingReply) {
      throw new Error('Could not find reply for updating.');
    }
    angular.copy(updatedReply, existingReply);
    discussion.revision = updatedReply.discussionRevision;
  }

  _replyDelete(deletedReply) {
    const discussion = this._discussionGet(deletedReply.discussion);
    const removed = remove(discussion.replies, {id: deletedReply.id});
    discussion.revision = deletedReply.discussionRevision;
  }
}

export default function(app) {
  app.component('document', {
    template,
    controller: [
      '$scope', '$route', '$routeSegment', '$document', '$http', 'config',
      '$rootScope', '$filter', 'authService', 'notificationService',
      'metaService', 'websocketService', '$timeout', '$window', 'tourService',
      function(
        $scope, $route, $routeSegment, $document, $http, config, $rootScope,
        $filter, authService, notificationService, metaService, websocketService,
        $timeout, $window, tourService
      ) {
        const $ctrl = this;

        // expose authService
        $ctrl.auth = authService;

        // expose the routeSegment to be able to determine the active tab in the
        // template.
        $ctrl.$routeSegment = $routeSegment;

        $ctrl.tour = tourService;

        $ctrl.documentId = $routeSegment.$routeParams.documentId;

        $ctrl.sidenavOpen = true;

        // fetch document
        $http.get(`${config.apiUrl}/documents/${$ctrl.documentId}/revisions/`)
          .success(response => {
            $ctrl.revisions = response.revisions;

            if (!$ctrl.revisions) {
              notificationService.notifications.push({
                type: 'error',
                message: 'Document has no revisions – magic!'
              });
              return;
            }

            // use latest revision for metadata
            $ctrl.latestRevision = orderBy($ctrl.revisions, 'publishedAt', 'desc')[0];

            const metadata = getRevisionMetadata($ctrl.latestRevision);
            metaService.set({
              title: $ctrl.latestRevision.title + ' · PaperHive',
              meta: metadata
            });
          })
          .error(data => {
            notificationService.notifications.push({
              type: 'error',
              message: data.message ? data.message :
                'could not fetch document revisions (unknown reason)'
            });
          });

        // execute async function and display errors as notifications
        async function asyncExec(asyncFun, context, errorMessage) {
          try {
            await asyncFun.bind(context)();
          } catch (error) {
            console.error(error);
            notificationService.notifications.push({
              type: 'error',
              message: `${errorMessage} (${error.message || error.data.message || 'unknown reason'}).`,
            });
          }
        }

        // instanciate and init controller for discussions
        $ctrl.discussionsCtrl = new DiscussionsController(
          $ctrl.documentId, config, $scope, $http, websocketService
        );
        asyncExec($ctrl.discussionsCtrl.init, $ctrl.discussionsCtrl,
                  'Could not initialize discussions');
      }
    ],
  });
};
