'use strict';

import template from './partner-logos.html!text';

export default function(app) {
  app.component('partnerLogos', {
    bindings: {},
    controller: ['$http', function($http) {
      const ctrl = this;
    }],
    template,
  });
};
