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
      aggregation: IBucket[];
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
        this.items = this.aggregation && this.aggregation.map(bucket => ({
          term: bucket.term,
          count: bucket.count,
          countShort: getShortInteger(bucket.count),
          label: bucket.label || bucket.term,
          selected: this.selected && this.selected.indexOf(bucket.term) !== -1,
        }));
      }
    },
    template: require('./search-dropdown.html'),
  });
}
