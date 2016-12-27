import { getShortInteger } from '../utils/index';

export default function(app) {
  app.component('searchDateDropdown', {
    bindings: {
      facets: '<',
      filter: '<',
      onFilterUpdate: '&',
    },
    controller: class SearchDateDropdownCtrl {
      facets: any;
      filter: any;

      items: any[];
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
          ['$ctrl.filter.from', '$ctrl.filter.to'],
          this.updateCustom.bind(this),
        );

        $scope.$watchGroup(
          ['$ctrl.to', '$ctrl.from'],
          this.updateFilter.bind(this),
        );
      }

      updateCustom() {
        this.from = this.filter.from;
        this.to = this.filter.to;
      }

      updateFilter() {
        this.filter.from = this.from;
        this.filter.to = this.to;
      }

      updateItems() {
        this.items = [
          {key: undefined, label: 'No date filter'},
          {key: 'lastWeek', label: 'Last week'},
          {key: 'lastMonth', label: 'Last month'},
          {key: 'lastYear', label: 'Last year'},
        ].map(item => {
          const value = this.facets && item.key && this.facets[item.key];
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
