'use strict';

import template from './template.html';

export default function(app) {
  app.component('mainPage', {
    controller: class MainPageCtrl {
      static $inject = ['tourService'];
      constructor(public tourService) {}
    },
    template,
  });
};
