import Chartist from 'chartist';
import { map } from 'lodash';

import { getShortInteger } from '../utils/index';

export default function(app) {
  app.component('searchDate', {
    bindings: {
      facet: '<',
    },
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
      chartistData: any;
      facet: {};

      chartistEvents = {
        draw: event => {
          // center x labels at tick
          if (event.type === 'label' && event.axis.units.pos === 'x') {
            event.element.attr({ x: event.x - event.width / 2 });
          }
        },
      };

      $onChanges() {
        this.updateChartistData();
      }

      updateChartistData() {
        this.chartistData = undefined;
        if (!this.facet) return;
        const points = map(this.facet, (count, date) => {
          return {x: parseInt(date.substr(0, 4), 10), y: count};
        });
        this.chartistData = {series: [points]};
      }
    },
    template: require('./search-date.html'),
  });
}
