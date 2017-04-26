import { copy } from 'angular';
import { find } from 'lodash';

require('./onboarding.less');
require('./onboarding-bookmark.less');

export default function(app) {
  app.component('onboardingBookmark', {
    bindings: {
      active: '<',
      channelId: '<',
      onNext: '&',
    },
    controller: class OnboardingBookmarkCtrl {
      channelId: string;
      onNext: () => void;

      query: string;

      complete = false;
      searching = false;

      total: number;
      documentsScrollToken: string;
      documentsTotal: number;
      documents: any[] = [];
      totalUpdating = false;
      scrollUpdating = false;

      bookmarked = false;
      bookmarkSubmitting = {};

      static $inject = ['$http', 'documentsApi'];
      constructor(public $http, public documentsApi) {
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
        return Promise.all(documents.map(document => {
          return this.documentsApi.bookmarksGet(document.id)
            .then(data => {
              document.bookmarked = !!find(data.bookmarks, {channel: {id: this.channelId}});
              return document;
            });
        }));
      }

      toggleBookmark(document) {
        this.bookmarkSubmitting[document.id] = true;
        const promise = document.bookmarked
          ? this.documentsApi.bookmarkDelete(document.id, this.channelId)
          : this.documentsApi.bookmarkAdd(document.id, this.channelId);
        promise
          .then(() => {
            document.bookmarked = !document.bookmarked;
            if (document.bookmarked) this.bookmarked = true;
          })
          .finally(() => this.bookmarkSubmitting[document.id] = false);
      }

      next() {
        this.complete = true;
        this.onNext();
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
