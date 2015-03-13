'use strict';
module.exports = function (app) {
  require('./animate')(app);
  require('./mathjax.js')(app);
  require('./pdf.js')(app);
  require('./routes.js')(app);
};
