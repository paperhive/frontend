export default function(app) {
  app.component('searchDateDropdown', {
    bindings: {
      facets: '<',
      selected: '<',
      onSelect: '&',
    },
    controller: class SearchDateDropdownCtrl {
      const items = [
        {id: 'none', label: 'No date filter', count: 23054000, countShort: '2M'},
        {id: 'lastWeek', label: 'Last week', count: 32100, countShort: '32K'},
        {id: 'lastMonth', label: 'Last month', count: 148000, countShort: '148K'},
        {id: 'lastYear', label: 'Last year', count: 1263000, countShort: '1M'},
      ];
      // TODO: use from outside
      const selected = 'none';
    },
    template: require('./search-date-dropdown.html'),
  });
}
