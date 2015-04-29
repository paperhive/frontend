'use strict';
module.exports = function(app) {
  require('./animate')(app);
  require('./html5Mode')(app);
  require('./mathjax.js')(app);
  require('./pageTitleUpdate.js')(app);
  require('./pdf.js')(app);
  require('./routes.js')(app);
  require('./scroll.js')(app);
};
