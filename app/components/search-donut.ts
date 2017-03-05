import { equals } from 'angular';
import Chartist from 'chartist';
import jquery from 'jquery';
import { forEach, map } from 'lodash';

import { getShortInteger } from '../utils/index';

// todo: common interface
interface IBucket {
  term: string;
  count: number;
  label: string;
}

export default function(app) {
  app.component('searchDonut', {
    bindings: {
      aggregation: '<',
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
            el.on('mouseenter', () => this.$scope.$apply(() => {
              this.tooltipElement.addClass('in');
              this.tooltipLabel = event.meta.label || event.meta.term;
              this.tooltipValue = getShortInteger(event.value);
            }));
            el.on('mouseleave', () => this.tooltipElement.removeClass('in'));
            const slice = {term: event.meta.term, element: el};
            this.slices.push(slice);
            this.updateSlice(slice);
          }
        },
      };

      aggregation: {
        other: number;
        buckets: IBucket[];
      };
      selected: string[];
      onAdd: (o: {term}) => Promise<void>;
      onRemove: (o: {term}) => Promise<void>;
      tooltipElement: JQuery;
      tooltipLabel: string;
      tooltipValue: string;

      chartistData: any;
      slices: Array<{
        element: JQuery;
        term: any;
      }>;

      static $inject = ['$element', '$scope'];
      constructor(public $element, public $scope) {
        $scope.$watchCollection('$ctrl.selected', this.updateSlices.bind(this));
        this.tooltipElement = $element.find('> .tooltip');
        $element.on('mousemove', this.onMouseMove.bind(this));
      }

      $onChanges(changes) {
        if (changes.aggregation && !equals(changes.aggregation.currentValue, changes.aggregation.previousValue)) {
          this.updateChartistData();
        }
      }

      updateChartistData() {
        this.chartistData = undefined;
        this.slices = [];
        if (!this.aggregation) return;

        this.chartistData = {
          series: this.aggregation.buckets.map(bucket => ({
            value: bucket.count,
            meta: bucket,
          })),
        };
      }

      updateSlices() {
        this.slices.forEach(slice => this.updateSlice(slice));
      }

      updateSlice(slice) {
        if (this.selected.indexOf(slice.term) !== -1) {
          slice.element.addClass('ph-search-donut-slice-active');
        } else {
          slice.element.removeClass('ph-search-donut-slice-active');
        }
      }

      onMouseMove(event) {
        const height = this.tooltipElement.outerHeight();
        const width = this.tooltipElement.outerWidth();
        this.tooltipElement.css({
          top: event.offsetY - height + 'px',
          left: event.offsetX - Math.floor(width / 2) + 'px',
        });
      }

      onSliceClick(el: JQuery, meta: any) {
        this.$scope.$apply(() => {
          if (this.selected.indexOf(meta.term) === -1) {
            el.addClass('ph-search-donut-slice-active');
            this.onAdd({term: meta.term});
          } else {
            el.removeClass('ph-search-donut-slice-active');
            this.onRemove({term: meta.term});
          }
        });
      }
    },
    template: require('./search-donut.html'),
  });
}
