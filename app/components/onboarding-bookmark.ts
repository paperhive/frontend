import { copy } from 'angular';
import { cloneDeep, find } from 'lodash';

require('./onboarding.less');
require('./onboarding-bookmark.less');

export default function(app) {
  app.component('onboardingBookmark', {
    bindings: {
      active: '<',
      onNext: '&',
    },
    controller: class OnboardingBookmarkCtrl {
      onNext: () => void;

      query: string;

      searching = false;

      total: number;
      documentsScrollToken: string;
      documentsTotal: number;
      documents: any[] = [];
      totalUpdating = false;
      scrollUpdating = false;

      bookmarked = false;
      bookmarkSubmitting = {};

      static $inject = ['$http', 'authService', 'channelService', 'documentsApi', 'personService'];
      constructor(public $http, public authService, public channelService, public documentsApi, public personService) {
        this.updateTotal();
      }

      getBib(document) {
        const items = [];
        const journal = document.journal
          && (document.journal.nameShort || document.journal.nameLong);
        if (journal) items.push(journal);
        if (document.volume) items.push(`vol. ${document.volume}`);
        if (document.issue) items.push(`issue ${document.issue}`);
        if (document.publisher) items.push(document.publisher);
        return items.join(', ');
      }

      getBookmarks(documents) {
        const channelId = this.authService.user.account.onboarding.channel.channel;
        if (!channelId) throw new Error('no channel available');

        return Promise.all(documents.map(document => {
          return this.documentsApi.bookmarksGet(document.id)
            .then(data => {
              document.bookmarked = !!find(data.bookmarks, {channel: {id: channelId}});
              return document;
            });
        }));
      }

      toggleBookmark(document) {
        const channelId = this.authService.user.account.onboarding.channel.channel;
        if (!channelId) throw new Error('no channel available');

        this.bookmarkSubmitting[document.id] = true;
        const promise = document.bookmarked
          ? this.documentsApi.bookmarkDelete(document.id, channelId)
          : this.documentsApi.bookmarkAdd(document.id, channelId);
        promise
          .then(() => {
            document.bookmarked = !document.bookmarked;
            if (document.bookmarked) this.bookmarked = true;
          })
          .finally(() => this.bookmarkSubmitting[document.id] = false);
      }

      next() {
        const person = cloneDeep(this.authService.user);
        person.account.onboarding = person.account.onboarding || {};
        person.account.onboarding.bookmarks = {completedAt: new Date()};
        this.personService.update(person).then(() => this.onNext());
      }

      scroll() {
        this.scrollUpdating = true;
        this.documentsApi.searchScroll(this.documentsScrollToken)
          .then(data => this.getBookmarks(data.documents))
          .then(documents => this.documents.push(...documents))
          .finally(() => this.scrollUpdating = false);
      }

      search() {
        this.searching = true;
        this.documentsApi.search({q: this.query, restrictToLatest: true, size: 3})
          .then(data => {
            this.documentsScrollToken = data.scrollToken;
            this.documentsTotal = data.total;
            return this.getBookmarks(data.documents);
          })
          .then(documents => copy(documents, this.documents))
          .finally(() => this.searching = false);
      }

      updateTotal() {
        this.totalUpdating = true;
        this.documentsApi.search({restrictToLatest: true})
          .then(data => this.total = data.total)
          .finally(() => this.totalUpdating = false);
      }
    },
    template: require('./onboarding-bookmark.html'),
  });
};
