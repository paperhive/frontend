import { copy } from 'angular';
import { clone, isArray, isEqual } from 'lodash';

class DateFilter {
  data: {}
  mode: string;
  from: Date;
  to: Date;
}

// André: subclassing Array is still a pain in the ass in JS
//        -> use items property
class FilterArray {
  items = [];

  add(item) {
    if (this.items.indexOf(item) !== -1) return;
    this.items.push(item);
  }

  isEmpty() {
    return this.items.length === 0;
  }

  remove(item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  replace(items) {
    this.reset();
    items.forEach(item => this.items.push(item));
  }

  reset() {
    this.items.splice(0, this.items.length);
  }

  setFromQuery(val) {
    let array = val || [];
    // if param is just a single value (i.e. parameter is provided once) then
    // we need to turn the string into an array
    if (!isArray(array)) {
      array = [array];
    }
    array = clone(array).sort();
    if (isEqual(array, this.items)) return;

    this.replace(array);
  }
}

export default function(app) {
  app.component('search', {
    controller: class SearchCtrl {
      const maxPerPage = 10;
      page = 1;
      query: string;
      queryModel: string;

      facets = {};
      filters = {
        access: new FilterArray(),
        date: new DateFilter(),
        documentType: new FilterArray(),
        journal: new FilterArray(),
      };
      resultsTotal: number;
      results: any[];
      total: number;
      updatingResults: boolean;
      updatingTotal: boolean;

      static $inject = ['config', '$http', '$location', '$scope',
        'feedbackModal', 'notificationService'];

      constructor(public config, public $http, public $location, $scope,
                  public feedbackModal, public notificationService) {
        $scope.$on('$locationChangeSuccess', this.updateFromLocation.bind(this));
        this.updateFromLocation();

        $scope.$watchGroup(
          ['$ctrl.query', '$ctrl.page'],
          (newVals, oldVals) => newVals !== oldVals && this.updateResults(),
        );

        ['access', 'documentType', 'journal'].forEach(filter => $scope.$watchCollection(
          `$ctrl.filters.${filter}.items`,
          (newVals, oldVals) => newVals !== oldVals && this.updateResults(),
        ));

        this.updateResults();
        this.updateTotal();
      }

      scrollToTop() {
        window.scrollTo(0, 0);
      }

      submitQuery() {
        this.query = this.queryModel;
      }

      // update controller variables from location
      updateFromLocation() {
        const search = this.$location.search();
        this.query = search.query;
        this.page = search.page || 1;

        this.filters.access.setFromQuery(search.access);
        this.filters.documentType.setFromQuery(search.documentType);
        this.filters.journal.setFromQuery(search.journal);

        this.queryModel = this.query;
      }

      // update location from controller
      updateLocation() {
        this.$location.search({
          query: this.query,
          page: this.page > 1 ? this.page : undefined,
          access: this.filters.access.items,
          documentType: this.filters.documentType.items,
          journal: this.filters.journal.items,
        });
      }

      updateResults() {
        this.updateLocation();

        this.resultsTotal = undefined;
        this.results = undefined;
        this.updatingResults = true;

        return this.$http.get(`${this.config.apiUrl}/documents/search`, {
          params: {
            q: this.query,
            limit: this.maxPerPage,
            skip: (this.page - 1) * this.maxPerPage,
            restrictToLatest: true,
            // journals: this.selectedJournals,
          },
        })
        .then(
          response => {
            this.resultsTotal = response.data.total;
            this.results = response.data.documents;
            // this.facets = response.data.facets;
            this.facets = require('./search-facets.json');
          },
          response => this.notificationService.notifications.push({
            type: 'error',
            message: 'Could not fetch documents',
          }),
        )
        .finally(() => this.updatingResults = false);
      }

      updateTotal() {
        this.updatingTotal = true;
        return this.$http.get(`${this.config.apiUrl}/documents/search`, {
          restrictToLatest: true,
        }).then(
          response => this.total = response.data.total,
          response => this.notificationService.notifications.push({
            type: 'error',
            message: 'Could not fetch documents',
          }),
        ).finally(() => this.updatingTotal = false);
      }
    },
    template: require('./search.html'),
  });
};
