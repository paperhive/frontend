import Chartist from 'chartist';
import { map } from 'lodash';

import { getShortInteger } from '../utils/index';

export default function(app) {
  app.component('searchDate', {
    bindings: {
      aggregation: '<',
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
      aggregation: any[];

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
        if (!this.aggregation) return;

        this.chartistData = {
          series: [
            this.aggregation.map(bucket => ({x: bucket.key, y: bucket.count})),
          ],
        };
      }
    },
    template: require('./search-date.html'),
  });
}
