'use strict';

import template from './user-profile.html';

export default function(app) {
  app.component(
    'userProfile', {
      template,
      bindings: {
        'user': '<',
      }
    });
};
