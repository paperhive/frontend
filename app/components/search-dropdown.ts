import { equals } from 'angular';
import Chartist from 'chartist';
import jquery from 'jquery';
import { forEach, map } from 'lodash';

import { getShortInteger } from '../utils/index';

export default function(app) {
  app.component('searchDropdown', {
    bindings: {
      facets: '<',
      selected: '<',
      onAdd: '&',
      onRemove: '&',
    },
    controller: class SearchDropdownCtrl {
      facets: { [key: string]: number; };
      selected: string[];
      onAdd: (o: {key: string}) => Promise<void>;
      onRemove: (o: {key: string}) => Promise<void>;

      items: Array<{key: string, count: number, selected: boolean}>;

      $onChanges() {
        this.items = map(this.facets, (count, key) => ({
          key,
          count,
          countShort: getShortInteger(count),
          selected: this.selected && this.selected.indexOf(key) !== -1,
        }));
      }

      toggle($event, item) {
        if (item.selected) {
          this.onRemove({key: item.key});
        } else {
          this.onAdd({key: item.key});
        }
        $event.stopPropagation();
      }
    },
    template: require('./search-dropdown.html'),
  });
}
