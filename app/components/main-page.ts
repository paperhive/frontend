'use strict';

import template from './main-page.html';

export default function(app) {
  app.component('mainPage', {
    controller: class MainPageCtrl {
      static $inject = ['tourService'];
      constructor(public tourService) {}
    },
    template,
  });
};
