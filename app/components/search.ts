import { copy } from 'angular';
import { assign, clone, cloneDeep, find, forEach, isArray, isEqual, pickBy } from 'lodash';

import { isDocumentItemSharedWithUser, postProcessHits } from '../utils/document-items';

require('./search.less');

type QueryValue = string | boolean | number | Date;

interface IQueryObj {
  [k: string]: QueryValue | QueryValue[];
}

interface IFilter {
  getUrlQuery(): IQueryObj;
  getApiQuery(): IQueryObj;
  updateFromUrlQuery(query: IQueryObj);
}

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
  onUpdate(): void;
}

interface IDateFilterData {
  mode: string;
  from: string;
  to: string;
}

class DateFilter implements IFilter {
  mode: string;
  from: Date;
  to: Date;

  constructor(public options: IDateFilterOptions) {}

  // round to beginning of day
  static getDay(date) {
    const newDate = new Date(date);
    newDate.setUTCHours(0);
    newDate.setUTCMinutes(0);
    newDate.setUTCSeconds(0);
    newDate.setUTCMilliseconds(0);
    return newDate;
  }

  update(data: IDateFilterData) {
    const currentData = {mode: this.mode, from: this.from, to: this.to};
    const newData = {mode: undefined, from: undefined, to: undefined};

    // sanitize data
    switch (data.mode) {
      case undefined: break;
      case 'custom': {
        if (!data.from && !data.to) throw new Error('from or to required');
        newData.mode = 'custom';
        newData.from = data.from && parseValue(data.from, 'date');
        newData.to = data.to && parseValue(data.to, 'date');
        break;
      }
      case 'lastYear': {
        newData.mode = 'lastYear';
        if (currentData.mode === 'lastYear') {
          newData.from = currentData.from;
          break;
        }
        const date = new Date();
        date.setUTCFullYear(date.getUTCFullYear() - 1);
        newData.from = DateFilter.getDay(date);
        break;
      }
      case 'lastMonth': {
        newData.mode = 'lastMonth';
        if (currentData.mode === 'lastMonth') {
          newData.from = currentData.from;
          break;
        }
        const date = new Date();
        date.setUTCMonth(date.getUTCMonth() - 1);
        newData.from = DateFilter.getDay(date);
        break;
      }
      case 'lastWeek': {
        newData.mode = 'lastWeek';
        if (currentData.mode === 'lastWeek') {
          newData.from = currentData.from;
          break;
        }
        const date = new Date();
        date.setUTCDate(date.getUTCDate() - 7);
        newData.from = DateFilter.getDay(date);
        break;
      }
      default:
        throw new Error(`date mode ${data.mode} unknown`);
    }

    if (isEqual(currentData, newData)) return;
    assign(this, newData);
    this.options.onUpdate();
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

function parseValue(value: string, type: string) {
  switch (type) {
    case 'string': return value;
    case 'boolean':
      if (value === 'true') return true;
      if (value === 'false') return false;
      throw new Error('not true or false');
    case 'integer': {
      const integer = parseInt(value, 10);
      if (isNaN(integer)) throw new Error('is not an integer');
      return integer;
    }
    case 'number': {
      const num = parseFloat(value);
      if (isNaN(num)) throw new Error('is not a number');
      return num;
    }
    case 'date': {
      const milliseconds = Date.parse(value);
      if (!milliseconds) throw new Error('is not an ISO8601 date');
      return new Date(milliseconds);
    }
    default: throw new Error(`type ${this.options.type} not recognized`);
  }
}

interface ITermsFilterOptions {
  type: string;
  apiParameters: {
    term: string;
    missing?: string;
  };
  urlParameters: {
    term: string;
    missing?: string;
  };
  onUpdate(): void;
}

class TermsFilter<T extends QueryValue> implements IFilter {
  private terms: T[] = [];

  constructor(public options: ITermsFilterOptions) {}

  add(term: T) {
    this.terms.push(term);
    this.options.onUpdate();
  }

  remove(term: T) {
    this.terms.splice(this.terms.indexOf(term), 1);
    this.options.onUpdate();
  }

  reset() {
    this.terms.splice(0, this.terms.length);
    this.options.onUpdate();
  }

  isActive() {
    return this.terms.length > 0;
  }

  getApiQuery() {
    const terms = this.terms.filter(term => term !== null);
    const result = {
      [this.options.apiParameters.term]: terms.length > 0 ? terms : undefined,
    } as any;
    if (this.options.apiParameters.missing) {
      result[this.options.apiParameters.missing] =
        this.terms.indexOf(null) !== -1 ? true : undefined;
    }
    return result;
  }

  getUrlQuery() {
    const result = {};
    const terms = this.terms
      .filter(term => term !== null)
      .map(term => term === null ? null : term.toString());
    if (terms.length > 0) result[this.options.urlParameters.term] = terms;
    if (this.options.urlParameters.missing && this.terms.indexOf(null) !== -1) {
      result[this.options.urlParameters.missing] = 'true';
    }
    return result;
  }

  updateFromUrlQuery(query) {
    const urlTerms = query[this.options.urlParameters.term] as string[];
    const newTerms = [];
    if (isArray(urlTerms)) {
      urlTerms.forEach(term => newTerms.push(parseValue(term, this.options.type)));
    } else if (urlTerms !== undefined) {
      newTerms.push(parseValue(urlTerms, this.options.type));
    }

    if (this.options.urlParameters.missing) {
      const missing = query[this.options.urlParameters.missing] as string;
      if (missing !== undefined && parseValue(missing, 'boolean')) {
        newTerms.push(null);
      }
    }

    if (!isEqual(newTerms, this.terms)) {
      copy(newTerms, this.terms);
      this.options.onUpdate();
    }
  }
}

class SelectCtrl {
  selectedItem: any;
  items: any[];

  constructor(public options, items, public defaultId) {
    this.items = cloneDeep(items);
    this.selectedItem = find(this.items, {id: defaultId}) || this.items && this.items[0];
    this.selectedItem.selected = true;
  }

  select(selectItem) {
    if (this.selectedItem.id === selectItem.id) return;
    this.selectedItem.selected = false;
    selectItem.selected = true;
    this.selectedItem = selectItem;
    this.options.onUpdate();
  }

  getApiQuery() {
    return {[this.options.apiParameter]: this.selectedItem.id};
  }

  getUrlQuery() {
    return {
      [this.options.urlParameter]: this.selectedItem.id === this.defaultId
        ? undefined : this.selectedItem.id,
    };
  }

  updateFromUrlQuery(query) {
    const selectedId = query[this.options.urlParameter] || this.defaultId;
    const item = find(this.items, {id: selectedId});
    if (!item) throw new Error('invalid parameter');
    this.select(item);
  }
}

export default function(app) {
  app.component('search', {
    controller: class SearchCtrl {
      filterCtrls: {[k: string]: IFilter} = {
        access: new TermsFilter({
          onUpdate: this.updateCtrlParams.bind(this),
          type: 'boolean',
          apiParameters: {term: 'openAccess', missing: 'openAccessMissing'},
          urlParameters: {term: 'access', missing: 'accessMissing'},
        }),
        crossrefMember: new TermsFilter({
          onUpdate: this.updateCtrlParams.bind(this),
          type: 'string',
          apiParameters: {term: 'crossrefMember', missing: 'crossrefMemberMissing'},
          urlParameters: {term: 'crossrefMember', missing: 'crossrefMemberMissing'},
        }),
        documentType: new TermsFilter({
          onUpdate: this.updateCtrlParams.bind(this),
          type: 'string',
          apiParameters: {term: 'documentType', missing: 'documentTypeMissing'},
          urlParameters: {term: 'documentType', missing: 'documentTypeMissing'},
        }),
        funder: new TermsFilter({
          onUpdate: this.updateCtrlParams.bind(this),
          type: 'string',
          apiParameters: {term: 'funder'},
          urlParameters: {term: 'funder'},
        }),
        journal: new TermsFilter({
          onUpdate: this.updateCtrlParams.bind(this),
          type: 'string',
          apiParameters: {term: 'journal', missing: 'journalMissing'},
          urlParameters: {term: 'journal', missing: 'journalMissing'},
        }),
        publishedAt: new DateFilter({
          onUpdate: this.updateCtrlParams.bind(this),
          apiParameters: {from: 'publishedAfter', to: 'publishedBefore'},
          urlParameters: {mode: 'publishedAtMode', from: 'publishedAtFrom', to: 'publishedBefore'},
        }),
        remoteType: new TermsFilter({
          onUpdate: this.updateCtrlParams.bind(this),
          type: 'string',
          apiParameters: {term: 'remoteType'},
          urlParameters: {term: 'remoteType'},
        }),
        tag: new TermsFilter({
          onUpdate: this.updateCtrlParams.bind(this),
          type: 'string',
          apiParameters: {term: 'tag'},
          urlParameters: {term: 'tag'},
        }),
      };

      searchFetchCtrls = {
        sortBy: new SelectCtrl(
          {
            onUpdate: this.updateCtrlParams.bind(this),
            apiParameter: 'sortBy',
            urlParameter: 'sortBy',
          },
          [
            {id: 'score', label: 'Best matches first'},
            {id: '-publishedAt', label: 'Most recent first'},
            {id: '+publishedAt', label: 'Oldest first'},
          ],
          'score',
        ),
      };

      queryModel: string;

      // parameters defining the result set (for search *and* aggregations)
      searchParams: any = {};
      filterCtrlParams: any = {};

      searchFetchLimit = 10;
      // parameters defining how the results are fetched
      searchFetchParams = {
        sortBy: 'score',
      };

      documentsParams: any = {};
      documentsUpdating: boolean;
      documentsCanceller: any;
      searchTotal: number;
      searchHits: any[] = [];
      searchHitsComplete: boolean;

      documentsScrollUpdating: boolean;
      documentsScrollCanceller: any;

      filtersParams: any = {};
      filtersUpdating: boolean;
      filtersCanceller: any;
      filters: any;

      totalUpdating: boolean;
      total: number;

      static $inject = ['config', '$http', '$location', '$q', '$scope',
        'authService', 'feedbackModal', 'notificationService'];

      constructor(public config, public $http, public $location, public $q, $scope,
                  public authService, public feedbackModal, public notificationService) {

        $scope.$on('$locationChangeSuccess', this.updateFromLocation.bind(this));
        this.updateFromLocation();

        $scope.$watchCollection('$ctrl.searchParams', this.updateParams.bind(this));
        $scope.$watchCollection('$ctrl.searchFetchParams', this.updateParams.bind(this));
        $scope.$watchCollection('$ctrl.filterCtrlParams', this.updateParams.bind(this));

        $scope.$watchCollection('$ctrl.documentsParams', this.fetchDocuments.bind(this));
        $scope.$watchCollection('$ctrl.filtersParams', this.fetchFilters.bind(this));
        this.fetchTotal();
      }

      isSharedWithYou(documentItem) {
        return isDocumentItemSharedWithUser(documentItem, this.authService.user);
      }

      submitQuery() {
        // set to undefined if emtpy string
        this.searchParams.query = this.queryModel || undefined;
      }

      // update controller variables from location
      updateFromLocation() {
        const search = this.$location.search();

        // redirect for springer
        const {remoteType} = search;
        if (remoteType === 'springer') {
          delete search.remoteType;
          search.crossrefMember = '297';
        }

        const query = search.query;

        // set query input model
        this.queryModel = query;

        // set result set params
        // TODO: check if array is equal (otherwise digest is triggered)
        // this.searchParams.in = ['authors', 'ids', 'title']; // TODO
        this.searchParams.query = query;

        // set params
        forEach(this.filterCtrls, ctrl => ctrl.updateFromUrlQuery(search));
        forEach(this.searchFetchCtrls, ctrl => ctrl.updateFromUrlQuery(search));
      }

      // update location from controller
      updateLocation() {
        const search = {
          // result set params
          // TODO:
          // in: isEqual(this.searchParams.in.sort(), ['authors', 'ids', 'title']) ?
          //  undefined : this.searchParams.in,
          query: this.searchParams.query ? this.searchParams.query : undefined,
        };

        // add parameters
        forEach(this.filterCtrls, ctrl => assign(search, ctrl.getUrlQuery()));
        forEach(this.searchFetchCtrls, ctrl => assign(search, ctrl.getUrlQuery()));

        // update location
        this.$location.search(search);
      }

      static updateCtrlParams(ctrls, targetParams) {
        const params = {};
        forEach(ctrls, (filter: IFilter) => assign(params, filter.getApiQuery()));
        copy(pickBy(params, v => v !== undefined), targetParams);
      }

      updateCtrlParams() {
        SearchCtrl.updateCtrlParams(this.filterCtrls, this.filterCtrlParams);
        SearchCtrl.updateCtrlParams(this.searchFetchCtrls, this.searchFetchParams);
      }

      updateParams() {
        const documentsParams = assign(
          {
            groupBy: 'document',
            groupHits: 'true',
            limit: this.searchFetchLimit,
          },
          this.searchParams,
          this.searchFetchParams,
          this.filterCtrlParams,
        );
        const filtersParams = assign(
          {},
          this.searchParams,
          this.filterCtrlParams,
        );

        copy(pickBy(documentsParams, v => v !== undefined), this.documentsParams);
        copy(pickBy(filtersParams, v => v !== undefined), this.filtersParams);
      }

      fetchDocuments() {
        this.updateLocation();

        // reset
        this.documentsUpdating = true;
        if (this.documentsCanceller) this.documentsCanceller.resolve();
        this.documentsCanceller = this.$q.defer();
        delete this.searchTotal;
        delete this.searchHitsComplete;
        this.searchHits.splice(0, this.searchHits.length);

        // also cancel scroll requests
        if (this.documentsScrollCanceller) this.documentsScrollCanceller.resolve();
        delete this.documentsScrollCanceller;
        this.documentsScrollUpdating = false;

        // TODO: use documentItemsApi
        return this.$http.get(
          `${this.config.apiUrl}/document-items/search`,
          {
            params: this.documentsParams,
            timeout: this.documentsCanceller.promise,
          },
        )
          .then(
            response => {
              this.searchTotal = response.data.totalItemCount;
              copy(postProcessHits(response.data.hits), this.searchHits);
            },
            response => {
              // request cancelled?
              if (response.status === -1) return;
              // display error
              this.notificationService.notifications.push({
                type: 'error',
                message: 'Could not fetch documents',
              });
            },
          )
          .finally(() => {
            this.documentsUpdating = false;
            delete this.documentsCanceller;
          });
      }

      fetchDocumentsScroll() {
        // reset
        this.documentsScrollUpdating = true;
        if (this.documentsScrollCanceller) {
          this.documentsScrollCanceller.resolve();
        }
        this.documentsScrollCanceller = this.$q.defer();

        // TODO: use documentItemsApi
        return this.$http.get(
          `${this.config.apiUrl}/document-items/search`,
          {
            params: {
              ...this.documentsParams,
              skip: this.searchHits.length,
            },
            timeout: this.documentsScrollCanceller.promise,
          },
        )
          .then(
            response => {
              this.searchHits.push(...postProcessHits(response.data.hits));
              if (response.data.hits.length < this.searchFetchLimit) {
                this.searchHitsComplete = true;
              }
            },
            response => {
              // request cancelled?
              if (response.status === -1) return;
              // display error
              this.notificationService.notifications.push({
                type: 'error',
                message: 'Could not fetch documents',
              });
            },
          )
          .finally(() => {
            this.documentsScrollUpdating = false;
            delete this.documentsScrollCanceller;
          });
      }

      fetchFilters() {
        // reset
        this.filtersUpdating = true;
        if (this.filtersCanceller) {
          this.filtersCanceller.resolve();
        }
        this.filtersCanceller = this.$q.defer();

        // TODO: use documentItemsApi
        return this.$http.get(
          `${this.config.apiUrl}/document-items/search/filters`,
          {params: this.filtersParams, timeout: this.filtersCanceller.promise},
        )
          .then(
            response => {
              this.filters = response.data.filters;
            },
            response => {
              // request cancelled?
              if (response.status === -1) return;
              // display error
              this.notificationService.notifications.push({
                type: 'error',
                message: 'Could not fetch filters',
              });
            },
          )
          .finally(() => {
            this.filtersUpdating = false;
            delete this.filtersCanceller;
          });
      }

      fetchTotal() {
        this.totalUpdating = true;
        // TODO: use documentItemsApi
        return this.$http.get(`${this.config.apiUrl}/document-items/search`).then(
          response => this.total = response.data.totalItemCount,
          response => this.notificationService.notifications.push({
            type: 'error',
            message: 'Could not fetch documents',
          }),
        ).finally(() => this.totalUpdating = false);
      }
    },
    template: require('./search.html'),
  });
}
