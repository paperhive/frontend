'use strict';

export default function(app) {
  app.component('search', {
    controller: class SearchCtrl {
      const maxPerPage = 10;
      page = 1;
      query: string;
      queryModel: string;

      facets: {};
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

        $scope.$watchGroup(['$ctrl.query', '$ctrl.page'], () => {
          this.updateLocation();
          this.updateResults();
        });

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
        this.query = this.$location.search().query;
        this.page = this.$location.search().page || 1;

        this.queryModel = this.query;
      }

      // update location from controller
      updateLocation() {
        this.$location.search({
          query: this.query,
          page: this.page > 1 ? this.page : undefined,
        });
      }

      updateResults() {
        this.resultsTotal = undefined;
        this.results = undefined;
        this.facets = undefined;
        this.updatingResults = true;

        return this.$http.get(`${this.config.apiUrl}/documents/search`, {
          params: {
            q: this.query,
            limit: this.maxPerPage,
            skip: (this.page - 1) * this.maxPerPage,
            restrictToLatest: true,
          },
        })
        .then(
          response => {
            this.resultsTotal = response.data.total;
            this.results = response.data.documents;
            this.facets = response.data.facets;
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
