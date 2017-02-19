import { copy } from 'angular';
import { assign, clone, isArray, isEqual } from 'lodash';

interface IDateFilterOptions {
  apiParameters: {
    from: string;
    to: string;
  };
  urlParameters: {
    mode: string;
    from: string;
    to: string;
  };
}

interface IDateFilterData {
  mode: string;
  from: string;
  to: string;
}

function parseDate(str) {
  const ms = Date.parse(str);
  if (isNaN(ms)) throw new Error(`invalid date`);
  return new Date(ms);
}

class DateFilter {
  mode: string;
  from: Date;
  to: Date;

  constructor(public options: IDateFilterOptions) {}

  update(data: IDateFilterData) {
    const currentData = {mode: this.mode, from: this.from, to: this.to};
    const newData = {mode: undefined, from: undefined, to: undefined};

    // sanitize data
    switch (data.mode) {
      case undefined: break;
      case 'custom': {
        if (!data.from && !data.to) throw new Error('from or to required');
        newData.mode = 'custom';
        newData.from = data.from && parseDate(data.from);
        newData.to = data.to && parseDate(data.to);
        break;
      }
      case 'lastYear': {
        newData.mode = 'lastYear';
        if (currentData.mode === 'lastYear') {
          newData.from = currentData.from;
          break;
        }
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        newData.from = date;
        break;
      }
      case 'lastMonth': {
        newData.mode = 'lastMonth';
        if (currentData.mode === 'lastMonth') {
          newData.from = currentData.from;
          break;
        }
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        newData.from = date;
        break;
      }
      case 'lastWeek': {
        newData.mode = 'lastWeek';
        if (currentData.mode === 'lastWeek') {
          newData.from = currentData.from;
          break;
        }
        const date = new Date();
        date.setDate(date.getDate() - 7);
        newData.from = date;
        break;
      }
      default:
        throw new Error(`date mode ${data.mode} unknown`);
    }

    if (isEqual(currentData, newData)) return;
    assign(this, newData);
    // TODO: notify?
  }

  updateFromUrlQuery(query) {
    this.update({
      mode: query[this.options.urlParameters.mode],
      from: query[this.options.urlParameters.from],
      to: query[this.options.urlParameters.to],
    });
  }

  getUrlQuery() {
    return {
      [this.options.urlParameters.mode]: this.mode,
      [this.options.urlParameters.from]: this.mode === 'custom' && this.from
        ? this.from.toISOString() : undefined,
      [this.options.urlParameters.to]: this.mode === 'custom' && this.to
        ? this.to.toISOString() : undefined,
    };
  }

  getApiQuery() {
    return {
      [this.options.apiParameters.from]: this.from,
      [this.options.apiParameters.to]: this.to,
    };
  }
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

      filters = {
        access: new FilterArray(),
        documentType: new FilterArray(),
        journal: new FilterArray(),
        publishedAt: new DateFilter({
          apiParameters: {from: 'publishedAfter', to: 'publishedBefore'},
          urlParameters: {mode: 'publishedAtMode', from: 'publishedAtFrom', to: 'publishedBefore'},
        }),
      };
      resultsTotal: number;
      results: any[];
      filterResults = {};
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
        $scope.$watchGroup(
          ['mode', 'from', 'to'].map(key => `$ctrl.filters.publishedAt.${key}`),
          (newVals, oldVals) => newVals !== oldVals && this.updateResults(),
        );

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
        this.filters.publishedAt.updateFromUrlQuery(search);

        this.queryModel = this.query;
      }

      // update location from controller
      updateLocation() {
        const search = {
          query: this.query,
          page: this.page > 1 ? this.page : undefined,
          // TODO: move to filters
          access: this.filters.access.items,
          documentType: this.filters.documentType.items,
          journal: this.filters.journal.items,
        };
        assign(search, this.filters.publishedAt.getUrlQuery());
        this.$location.search(search);
      }

      updateResults() {
        this.updateLocation();

        this.resultsTotal = undefined;
        this.results = undefined;
        this.updatingResults = true;

        const params = {
          q: this.query,
          limit: this.maxPerPage,
          skip: (this.page - 1) * this.maxPerPage,
          restrictToLatest: true,
        };
        assign(params, this.filters.publishedAt.getApiQuery());

        return this.$http.get(`${this.config.apiUrl}/documents/search`, {params})
        .then(
          response => {
            this.resultsTotal = response.data.total;
            this.results = response.data.documents;
            this.filterResults = response.data.filters;
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
