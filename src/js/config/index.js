'use strict';
module.exports = function (app) {
  require('./mathjax.js')(app);
  require('./pdf.js')(app);
  require('./routes.js')(app);
};
