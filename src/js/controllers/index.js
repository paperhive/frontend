module.exports = function (app) {
  require('./display.js')(app);
  require('./issue.js')(app);
};
