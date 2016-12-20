import { equals } from 'angular';
import Chartist from 'chartist';
import jquery from 'jquery';
import { forEach, map } from 'lodash';

import { getShortInteger } from '../utils/index';

export default function(app) {
  app.component('searchDonut', {
    bindings: {
      facets: '<',
      selected: '<',
      onAdd: '&',
      onRemove: '&',
    },
    controller: class SearchDonutCtrl {
      const chartistOptions = {
        donut: true,
        donutWidth: 30,
        fullWidth: true,
        showLabel: false,
      };

      const chartistEvents = {
        draw: event => {
          if (event.type === 'slice') {
            const el = jquery(event.element._node);
            el.on('click', () => this.onSliceClick(el, event.meta));
            this.sliceElements[event.meta] = el;
            this.updateSliceElement(event.meta);
          }
        },
      };

      facets: { [key: string]: number; };
      selected: string[];
      onAdd: (o: {key: string}) => Promise<void>;
      onRemove: (o: {key: string}) => Promise<void>;

      chartistData: any;
      sliceElements: { [key: string]: JQuery; };

      static $inject = ['$scope'];
      constructor(public $scope) {}

      $onChanges(changes) {
        if (changes.facets && !equals(changes.facets.currentValue, changes.facets.previousValue)) {
          this.updateChartistData();
        }
        if (changes.selected) {
          this.updateSliceElements();
        }
      }

      updateChartistData() {
        this.chartistData = undefined;
        this.sliceElements = {};
        if (!this.facets) return;

        this.chartistData = {
          series: map(this.facets, (count, key) => ({
            value: count,
            meta: key,
          })),
        };
      }

      updateSliceElements() {
        forEach(this.sliceElements, (_, key) => this.updateSliceElement(key));
      }

      updateSliceElement(key) {
        const el = this.sliceElements[key];
        if (!el) return;
        if (this.selected.indexOf(key) !== -1) {
          el.addClass('ph-search-donut-slice-active');
        } else {
          el.removeClass('ph-search-donut-slice-active');
        }
      }

      onSliceClick(el: JQuery, key: string) {
        this.$scope.$apply(() => {
          if (this.selected.indexOf(key) === -1) {
            el.addClass('ph-search-donut-slice-active');
            this.onAdd({key});
          } else {
            el.removeClass('ph-search-donut-slice-active');
            this.onRemove({key});
          }
        });
      }
    },
    template: require('./search-donut.html'),
  });
}
