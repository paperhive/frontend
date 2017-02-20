import { getShortInteger } from '../utils/index';

export default function(app) {
  app.component('searchDateDropdown', {
    bindings: {
      aggregations: '<',
      filter: '<',
      onFilterUpdate: '&',
    },
    controller: class SearchDateDropdownCtrl {
      aggregations: any;
      filter: any;
      onFilterUpdate: any;

      items: any[];
      mode: string;
      from: Date;
      to: Date;

      static $inject = ['$scope'];
      constructor($scope) {
        $scope.$watchGroup([
          '$ctrl.facets.lastWeek',
          '$ctrl.facets.lastMonth',
          '$ctrl.facets.lastYear',
        ], this.updateItems.bind(this));

        $scope.$watchGroup(
          ['$ctrl.filter.mode', '$ctrl.filter.from', '$ctrl.filter.to'],
          this.updateFromFilter.bind(this),
        );

        $scope.$watchGroup(
          ['$ctrl.mode', '$ctrl.to', '$ctrl.from'],
          this.updateFilter.bind(this),
        );
      }

      setMode(mode) {
        if (this.mode === mode) return;
        this.mode = mode;
        this.from = undefined;
        this.to = undefined;
      }

      updateFromFilter() {
        this.mode = this.filter.mode;
        this.from = this.filter.from;
        this.to = this.filter.to;
      }

      updateFilter() {
        // do not update if data is not ready
        if (this.mode === 'custom' && (!this.from && !this.to)) return;

        // send update
        this.onFilterUpdate({
          mode: this.mode,
          from: this.mode === 'custom' ? this.from : undefined,
          to: this.mode === 'custom' ? this.to : undefined,
        });
      }

      updateItems() {
        this.items = [
          {key: undefined, label: 'No date filter'},
          {key: 'lastWeek', label: 'Last week'},
          {key: 'lastMonth', label: 'Last month'},
          {key: 'lastYear', label: 'Last year'},
        ].map(item => {
          const value = this.aggregations && item.key && this.aggregations[item.key];
          return {
            key: item.key,
            label: item.label,
            value,
            valueShort: getShortInteger(value),
          };
        });
      }
    },
    template: require('./search-date-dropdown.html'),
  });
}
