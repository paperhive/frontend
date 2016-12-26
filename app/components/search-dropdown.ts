import { equals } from 'angular';
import Chartist from 'chartist';
import jquery from 'jquery';
import { forEach, map } from 'lodash';

import { getShortInteger } from '../utils/index';

// todo: common interface
interface IFacet {
  key: string;
  value: number;
  label: string;
}

export default function(app) {
  app.component('searchDropdown', {
    bindings: {
      description: '@',
      facets: '<',
      selected: '<',
      onAdd: '&',
      onRemove: '&',
    },
    controller: class SearchDropdownCtrl {
      facets: IFacet[];
      selected: string[];
      onAdd: (o: {key: string}) => Promise<void>;
      onRemove: (o: {key: string}) => Promise<void>;

      items: Array<{key: string, value: number, valueShort: number, label: string, selected: boolean}>;

      static $inject = ['$scope'];
      constructor($scope) {
        $scope.$watchCollection('$ctrl.selected', this.updateItems.bind(this));
      }

      $onChanges() {
        this.updateItems();
      }

      toggle(item) {
        if (item.selected) {
          this.onRemove({key: item.key});
        } else {
          this.onAdd({key: item.key});
        }
      }

      updateItems() {
        this.items = this.facets && this.facets.map(facet => ({
          key: facet.key,
          value: facet.value,
          valueShort: getShortInteger(facet.value),
          label: facet.label,
          selected: this.selected && this.selected.indexOf(facet.key) !== -1,
        }));
      }
    },
    template: require('./search-dropdown.html'),
  });
}
