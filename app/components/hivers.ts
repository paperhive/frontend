'use strict';

import template from './hivers.html';

export default function(app) {
  app.component(
    'hivers', {
      template,
      bindings: {
        hivers: '<',
      },
    });
};
