import Chartist from 'chartist';
import jquery from 'jquery';
import { map } from 'lodash';

import template from './search-journal.html';
import { getShortInteger } from '../utils/index';

export default function(app) {
  app.component('searchJournal', {
    bindings: {
      facet: '<',
      onJournalSelect: '&',
    },
    template,
    controller: class SearchJournalCtrl {
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
          }
        },
      };

      static $inject = ['$scope'];
      constructor(public $scope) {}

      $onChanges() {
        this.updateChartistData();
      }

      updateChartistData() {
        this.chartistData = undefined;
        if (!this.facet) return;

        this.chartistData = {
          series: map(this.facet, (count, journal) => ({
            value: count,
            meta: journal,
          })),
        };
      }

      onSliceClick(el, journal) {
        console.log(el, journal);
        this.onJournalSelect(journal);
      }
    },
  });
}
