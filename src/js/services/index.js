'use strict';
module.exports = function(app) {
  require('./auth.js')(app);
  require('./notifications.js')(app);
};
