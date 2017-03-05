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
  app.component('searchDropdown', {
    bindings: {
      description: '@',
      aggregation: '<',
      selected: '<',
      onAdd: '&',
      onRemove: '&',
    },
    controller: class SearchDropdownCtrl {
      aggregation: {
        buckets: IBucket[];
        other: number;
      };
      selected: string[];
      onAdd: (o: {term: string}) => Promise<void>;
      onRemove: (o: {term: string}) => Promise<void>;

      items: Array<{
        term: string,
        count: number,
        countShort: number,
        label: string,
        selected: boolean}
      >;
      other: number;
      otherShort: string;

      static $inject = ['$scope'];
      constructor($scope) {
        $scope.$watchCollection('$ctrl.selected', this.updateItems.bind(this));
      }

      $onChanges() {
        this.updateItems();
      }

      toggle(item) {
        if (item.selected) {
          this.onRemove({term: item.term});
        } else {
          this.onAdd({term: item.term});
        }
      }

      updateItems() {
        const selectedAggregationTerms = [];
        this.items = [];

        if (this.aggregation) {
          this.other = this.aggregation.other;
          this.otherShort = getShortInteger(this.other);
          this.aggregation.buckets.forEach(bucket => {
            const selected = this.selected && this.selected.indexOf(bucket.term) !== -1;
            if (selected) selectedAggregationTerms.push(bucket.term);

            this.items.push({
              term: bucket.term,
              count: bucket.count,
              countShort: getShortInteger(bucket.count),
              label: bucket.label || bucket.term,
              selected,
            });
          });
        }

        if (this.selected) {
          this.selected.forEach(term => {
            if (selectedAggregationTerms.indexOf(term) !== -1) return;
            this.items.unshift({
              term,
              count: undefined,
              countShort: undefined,
              label: term,
              selected: true,
            });
          });
        }
      }
    },
    template: require('./search-dropdown.html'),
  });
}
