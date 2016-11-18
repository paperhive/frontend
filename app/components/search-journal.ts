import Chartist from 'chartist';
import { forEach } from 'lodash';

import template from './search-journal.html';
import { getShortInteger } from '../utils/index';

export default function(app) {
  app.component('searchJournal', {
    bindings: {
      facet: '<',
    },
    template,
    controller: class SearchJournalCtrl {
      chartistOptions = {
        donut: true,
        donutWidth: 30,
        fullWidth: true,
        showLabel: false,
      };

      chartistEvents = {};

      $onChanges() {
        this.updateChartistData();
      }

      updateChartistData() {
        this.chartistData = undefined;
        if (!this.facet) return;

        this.chartistData = {series: [], labels: []};
        forEach(this.facet, (count, journal) => {
          this.chartistData.series.push(count);
          this.chartistData.labels.push(journal);
        });

        console.log(this.chartistData);
      }
    },
  });
}
