export default function(app) {
  app.component('mainPage', {
    controller: class MainPageCtrl {
      static $inject = ['tourService'];
      constructor(public tourService) {}
    },
    template: require('./main-page.html'),
  });
};
