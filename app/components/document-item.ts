'use strict';

import template from './document-item.html';

export default function(app) {
  app.component('documentItem', {
    bindings: {
      document: '<',
    },
    template
  });
};
