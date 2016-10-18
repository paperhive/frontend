import * as _ from 'lodash';
import * as angular from 'angular';
import { cloneDeep, find, findIndex, findLastIndex, merge, orderBy, pick, remove, some } from 'lodash';

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
    this.$scope.$apply(() => this.discussions = response.data.discussions);
    this.websocketInit();
  }

  async discussionSubmit(discussion) {
    const response = await this.$http({
      url: `${this.config.apiUrl}/discussions`,
      method: 'POST',
      data: discussion,
    });
    this.$scope.$apply(() => this._discussionCreate(response.data));
    return response.data;
  }

  async discussionUpdate(discussion) {
    const _discussion = pick(discussion, 'title', 'body', 'target', 'tags');
    const response = await this.$http({
      url: `${this.config.apiUrl}/discussions/${discussion.id}`,
      method: 'PUT',
      headers: {'If-Match': `"${discussion.revision}"`},
      data: _discussion,
    });
    this.$scope.$apply(() => this._discussionUpdate(response.data));
    return response.data;
  }

  async discussionDelete(discussion) {
    const response = await this.$http({
      url: `${this.config.apiUrl}/discussions/${discussion.id}`,
      method: 'DELETE',
      headers: {'If-Match': `"${discussion.revision}"`},
    });
    this.$scope.$apply(() => this._discussionDelete(discussion));
  }

  async replySubmit(reply) {
    const response = await this.$http({
      url: `${this.config.apiUrl}/replies`,
      method: 'POST',
      data: reply,
    });
    this.$scope.$apply(() => this._replyCreate(response.data));
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
    this.$scope.$apply(() => this._replyUpdate(response.data));
    return response.data;
  }

  async replyDelete(reply) {
    const response = await this.$http({
      url: `${this.config.apiUrl}/replies/${reply.id}`,
      method: 'DELETE',
      headers: {'If-Match': `"${reply.revision}"`},
    });
    this.$scope.$apply(() => this._replyDelete(merge(
      {},
      reply,
      {discussionRevision: response.data.discussionRevision}
    )));
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
    const discussion = find(this.discussions, {id: updatedDiscussion.id});
    if (!discussion) {
      throw new Error('Could not find discussion for updating.');
    }
    const replies = discussion.replies;
    angular.copy(updatedDiscussion, discussion);
    discussion.replies = replies;
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
    const replyIndex = findIndex(discussion.replies, {id: updatedReply.id});
    if (replyIndex === -1) {
      throw new Error('Could not find reply for updating.');
    }
    discussion.replies[replyIndex] = updatedReply;
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
    controller: class DocumentCtrl {
      subnavOpen = false;
      sidenavOpen = true;
      revisions: Array<any>;
      activeRevision: any;
      discussionsCtrl: DiscussionsController;
      filteredDiscussions: Array<any>;

      // note: do *not* use $routeSegment.$routeParams because they still
      // use the old state in $routeChangeSuccess events
      static $inject = ['$http', '$routeParams', '$scope', 'channelService', 'config',
        'DocumentController', 'metaService', 'notificationService', 'websocketService'];

      constructor($http, public $routeParams, $scope, public channelService, config,
        DocumentController, public metaService, notificationService, websocketService) {
        const documentId = $routeParams.documentId;

        this.documentCtrl = new DocumentController(documentId);
        this.documentCtrl.fetchRevisions(); // TODO: error handling
        this.documentCtrl.fetchHivers(); // TODO: error handling

        $scope.$watchGroup([
          '$ctrl.documentCtrl.revisions',
          '$ctrl.documentCtrl.revisionAccess',
          '$ctrl.documentCtrl.latestRevision',
          '$ctrl.documentCtrl.latestAccessibleRevision',
        ], this.updateActiveRevision.bind(this));

        $scope.$on('$routeChangeSuccess', this.updateActiveRevision.bind(this));

        $scope.$watch('$ctrl.activeRevision', this.updateMetadata.bind(this));

        // instanciate and init controller for discussions
        this.discussionsCtrl = new DiscussionsController(
          documentId, config, $scope, $http, websocketService
        );

        this.discussionsCtrl.init().catch(error => notificationService.notifications.push({
          type: 'error',
          message: error.message
        }));

        // update filtered discussions if discussions, channel or showAllChannels changed
        $scope.$watchCollection('$ctrl.discussionsCtrl.discussions', this.updateFilteredDiscussions.bind(this));
        $scope.$watch('$ctrl.channelService.selectedChannel', this.updateFilteredDiscussions.bind(this));
        $scope.$watch('$ctrl.channelService.showAllChannels', this.updateFilteredDiscussions.bind(this));
      }

      updateActiveRevision() {
        // nothing to do if there are no revisions or no revision access information
        if (!this.documentCtrl.revisions || !this.documentCtrl.revisionAccess) return;

        // don't overwrite if we already got one
        // (only if url changed)
        const urlRevisionId = this.$routeParams.revisionId;
        if (this.activeRevision && (!urlRevisionId || urlRevisionId && this.activeRevision.revision === urlRevisionId)) return;

        // prefer revision id from url
        if (urlRevisionId) {
          this.activeRevision = find(this.documentCtrl.revisions, {revision: urlRevisionId});
          return;
        }

        // then latest accessible or latest revision
        this.activeRevision =
          this.documentCtrl.latestAccessibleRevision ||
          this.documentCtrl.latestRevision;
      }

      updateFilteredDiscussions() {
        if (this.filteredDiscussions === undefined) this.filteredDiscussions = [];

        let discussions = this.discussionsCtrl.discussions;
        if (!discussions) {
          angular.copy([], this.filteredDiscussions);
          return;
        }

        // filter by channel if showAllChannels is false
        if (!this.channelService.showAllChannels) {
          discussions = discussions.filter(discussion => {
            const channelId = this.channelService.selectedChannel &&
              this.channelService.selectedChannel.id;
            return discussion.channel === channelId;
          });
        }

        angular.copy(discussions, this.filteredDiscussions);
      }

      updateMetadata() {
        if (!this.activeRevision) return;
        const metadata = getRevisionMetadata(this.activeRevision);
        this.metaService.set({
          title: this.activeRevision.title + ' · PaperHive',
          meta: metadata,
        });
      }
    },
  });
};
