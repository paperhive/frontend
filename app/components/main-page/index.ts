'use strict';

import template from './template.html!text';

export default function(app) {
  app.component('mainPage', {
    controller: class MainPageCtrl {
      static $inject = ['tourService'];
      constructor(public tourService) {}
    },
    template,
  });
};
