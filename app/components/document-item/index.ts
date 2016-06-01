'use strict';

import template from './template.html';

export default function(app) {
  app.component('documentItem', {
    bindings: {
      document: '<',
    },
    template
  });
};
