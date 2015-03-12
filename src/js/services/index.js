module.exports = function (app) {
  'use strict';

  require('./auth.js')(app);
  require('./notifications.js')(app);
};
