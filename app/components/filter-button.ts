import template from './filter-button.html';

export default function(app) {
  app.component('filterButton', {
    controller: class FilterButtonCtrl {
      static $inject = ['authService', 'channelService'];
      constructor(public authService, public channelService) {}
    },
    template,
  });
};
