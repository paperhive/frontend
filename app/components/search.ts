'use strict';

import Chartist from 'chartist';
import { map, max, min } from 'lodash';

import template from './search.html';

function getShortInteger(value) {
  const absValue = Math.abs(value);
  if (absValue < 1e3) return value;
  if (absValue < 1e6) return `${Math.floor(value * 1e-3)}K`;
  if (absValue < 1e9) return `${Math.floor(value * 1e-6)}M`;
  if (absValue < 1e12) return `${Math.floor(value * 1e-9)}G`;
  if (absValue < 1e15) return `${Math.floor(value * 1e-12)}T`;
  return value;
}

export default function(app) {
  app.component('search', {
    template,
    controller: class SearchCtrl {
      maxPerPage = 10;
      page = 1;

      chartistOptions = {
        axisX: {
          type: Chartist.AutoScaleAxis,
          onlyInteger: true,
        },
        axisY: {
          labelInterpolationFnc: getShortInteger,
          onlyInteger: true,
        },
        fullWidth: true,
      };

      chartistEvents = {
        draw: event => {
          if (event.type === 'label' && event.axis.units.pos === 'x') {
            event.element.attr({ x: event.x - event.width / 2 });
          }
        }
      };

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

      getChartistDataByYear(facet) {
        const maxBuckets = 100;
        let points = map(facet, (count, date) => {
          return {x: parseInt(date.substr(0, 4)), y: count};
        });

        return {series: [points]};
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
            this.chartistData = {
              date: this.getChartistDataByYear(response.data.facets.publishedByYear),
            };
            console.log(this.chartistData);
          },
          response => this.notificationService.notifications.push({
            type: 'error',
            message: 'Could not fetch documents'
          })
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
            message: 'Could not fetch documents'
          })
        ).finally(() => this.updatingTotal = false);
      }
    },
  });
};
