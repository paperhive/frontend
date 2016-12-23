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
            el.on('mouseenter', () => this.$scope.$apply(() => {
              this.tooltipShow = true;
              this.tooltipKey = event.meta;
              this.tooltipValue = getShortInteger(event.value);
            }));
            el.on('mouseleave', () => this.$scope.$apply(
              () => this.tooltipShow = false,
            ));
            this.sliceElements[event.meta] = el;
            this.updateSliceElement(event.meta);
          }
        },
      };

      facets: { [key: string]: number; };
      selected: string[];
      onAdd: (o: {key: string}) => Promise<void>;
      onRemove: (o: {key: string}) => Promise<void>;
      tooltipElement: JQuery;
      tooltipShow = false;
      tooltipKey: string;
      tooltipValue: string;

      chartistData: any;
      sliceElements: { [key: string]: JQuery; };

      static $inject = ['$element', '$scope'];
      constructor(public $element, public $scope) {
        $scope.$watchCollection('$ctrl.selected', this.updateSliceElements.bind(this));
        this.tooltipElement = $element.find('> .tooltip');
        $element.on('mousemove', this.onMouseMove.bind(this));
      }

      $onChanges(changes) {
        if (changes.facets && !equals(changes.facets.currentValue, changes.facets.previousValue)) {
          this.updateChartistData();
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

      onMouseMove(event) {
        const height = this.tooltipElement.outerHeight();
        const width = this.tooltipElement.outerWidth();
        this.tooltipElement.css({
          top: event.offsetY - height + 'px',
          left: event.offsetX - Math.floor(width / 2) + 'px',
        });
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
