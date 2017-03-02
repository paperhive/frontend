interface IItem {
  id: string;
  label: string;
  selected: boolean;
}

export default function(app) {
  app.component('dropdownSelect', {
    bindings: {
      description: '<',
      items: '<',
      onSelect: '&',
      onDeselect: '&',
    },
    controller: class DropdownSelectCtrl {
      description: string;
      items: IItem[];
      onSelect: (o: {item: IItem}) => Promise<void>;
      onDeselect: (o: {item: IItem}) => Promise<void>;

      toggle(item: IItem) {
        if (item.selected) {
          this.onDeselect({item});
        } else {
          this.onSelect({item});
        }
      }
    },
    template: require('./dropdown-select.html'),
  });
}
