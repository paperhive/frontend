export default function(app) {
  app.component('filterButton', {
    controller: class FilterButtonCtrl {
      static $inject = ['authService', 'channelService'];
      constructor(public authService, public channelService) {}
    },
    template: require('./filter-button.html'),
  });
};
