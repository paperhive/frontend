import { copy } from 'angular';
import { cloneDeep, find, get } from 'lodash';

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
      searchTotal: number;
      searchHits: any[] = [];
      searchHitsComplete: boolean;

      total: number;
      totalUpdating = false;
      scrollUpdating = false;

      bookmarked = false;
      bookmarkSubmitting = {};

      static $inject = ['$http', 'authService', 'channelService', 'documentItemsApi', 'personService'];
      constructor(public $http, public authService, public channelService,
                  public documentItemsApi, public personService) {
        this.updateTotal();
      }

      getBib(documentItem) {
        const items = [];
        const metadata = documentItem.metadata;
        const journal = metadata.journalShort || metadata.journal;
        if (journal) items.push(journal);
        if (metadata.volume) items.push(`vol. ${metadata.volume}`);
        if (metadata.issue) items.push(`issue ${metadata.issue}`);
        if (metadata.publisher) items.push(metadata.publisher);
        return items.join(', ');
      }

      getChannel() {
        return get(this, 'authService.user.account.onboarding.channel.channel');
      }

      isBookmarked(documentItem) {
        const channel = this.getChannel();
        if (!channel || !documentItem) return;
        return documentItem.channelBookmarks
          && documentItem.channelBookmarks.find(bookmark => bookmark.channel === channel);
      }

       addBookmark(documentItem) {
        const channel = this.getChannel();
        if (!channel) throw new Error('no channel available');
        this.bookmarkSubmitting[documentItem.id] = true;
        this.documentItemsApi.bookmarkAdd(documentItem.id, channel)
          .then(bookmark => {
            documentItem.channelBookmarks = documentItem.channelBookmarks || [];
            documentItem.channelBookmarks.push(bookmark);
            this.bookmarked = true;
          })
          .finally(() => this.bookmarkSubmitting[documentItem.id] = false);
      }

      removeBookmark(documentItem) {
        const channel = this.getChannel();
        if (!channel) throw new Error('no channel available');
        this.bookmarkSubmitting[documentItem.id] = true;
        this.documentItemsApi.bookmarkDelete(documentItem.id, channel)
          .then(() => {
            const index = documentItem.channelBookmarks.findIndex(bookmark => bookmark.channel === channel);
            documentItem.channelBookmarks.splice(index, 1);
          })
          .finally(() => this.bookmarkSubmitting[documentItem.id] = false);
      }

      next() {
        const person = cloneDeep(this.authService.user);
        person.account.onboarding = person.account.onboarding || {};
        person.account.onboarding.bookmarks = {completedAt: new Date()};
        this.personService.update(person).then(() => this.onNext());
      }

      search() {
        delete this.searchTotal;
        delete this.searchHitsComplete;
        this.searching = true;

        const options = {limit: 3, public: true} as any;
        if (this.query) options.query = this.query;

        this.documentItemsApi.search(options)
          .then(({hits, totalItemCount}) => {
            this.searchTotal = totalItemCount;
            copy(hits, this.searchHits);
          })
          .finally(() => this.searching = false);
      }

      searchScroll() {
        this.scrollUpdating = true;

        const options = {limit: 3, skip: this.searchHits.length, public: true} as any;
        if (this.query) options.query = this.query;

        this.documentItemsApi.search(options)
          .then(({hits}) => this.searchHits.push(...hits))
          .finally(() => this.scrollUpdating = false);
      }

      updateTotal() {
        this.totalUpdating = true;
        this.documentItemsApi.search()
          .then(({totalItemCount}) => this.total = totalItemCount)
          .finally(() => this.totalUpdating = false);
      }
    },
    template: require('./onboarding-bookmark.html'),
  });
}
