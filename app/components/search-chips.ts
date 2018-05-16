import { getShortInteger } from '../utils/index';

// todo: common interface
interface IBucket {
  term: string;
  count: number;
  label: string;
}

export default function(app) {
  app.component('searchChips', {
    bindings: {
      description: '@',
      aggregation: '<',
      selected: '<',
      onRemove: '&',
    },
    controller: class SearchChipsCtrl {
      aggregation: {
        buckets: IBucket[];
        other: number;
      };
      selected: string[];
      onRemove: (o: {term: string}) => Promise<void>;

      items: Array<{
        term: string,
        count: number,
        countShort: number,
        label: string,
      }>;

      static $inject = ['$scope'];
      constructor($scope) {
        $scope.$watchCollection('$ctrl.selected', this.updateItems.bind(this));
      }

      $onChanges() {
        this.updateItems();
      }

      updateItems() {
        this.items = [];

        if (!this.selected) return;
        this.selected.forEach(term => {
          const bucket = this.aggregation.buckets.find(item => item.term === term);
          if (bucket) {
            this.items.push({
              term: bucket.term,
              count: bucket.count,
              countShort: getShortInteger(bucket.count),
              label: bucket.label || bucket.term,
            });
          } else {
            this.items.push({
              term,
              count: undefined,
              countShort: undefined,
              label: term,
            });
          }
        });
      }
    },
    template: require('./search-chips.html'),
  });
}
