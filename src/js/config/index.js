module.exports = function (app) {
  require('./mathjax.js')(app);
  require('./routes.js')(app);
};
