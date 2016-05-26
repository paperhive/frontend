'use strict';

import template from './template.html';

export default function(app) {
  app.component(
    'userProfile', {
      template,
      bindings: {
        'user': '<',
      }
    });
};
