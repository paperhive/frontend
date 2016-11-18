import Chartist from 'chartist';
import { map } from 'lodash';

import template from './search-date.html';

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
  app.component('searchDate', {
    bindings: {
      facet: '<',
    },
    template,
    controller: class SearchDateCtrl {
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
          // center x labels at tick
          if (event.type === 'label' && event.axis.units.pos === 'x') {
            event.element.attr({ x: event.x - event.width / 2 });
          }
        }
      };

      $onChanges() {
        this.updateChartistData();
      }

      updateChartistData() {
        this.chartistData = undefined;
        if (!this.facet) return;
        const points = map(this.facet, (count, date) => {
          return {x: parseInt(date.substr(0, 4)), y: count};
        });
        this.chartistData = {series: [points]};
      }
    },
  });
}
