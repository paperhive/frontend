module.exports = function (app) {
  'use strict';
  require('./mathjax.js')(app);
  require('./pdf.js')(app);
  require('./routes.js')(app);
};
