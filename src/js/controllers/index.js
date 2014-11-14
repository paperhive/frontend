module.exports = function (app) {
  require('./display.js')(app);
  require('./issue.js')(app);
  require('./oauthOrcid.js')(app);
  require('./user.js')(app);
};
