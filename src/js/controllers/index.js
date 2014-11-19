module.exports = function (app) {
  require('./annotation.js')(app);
  require('./display.js')(app);
  require('./oauthOrcid.js')(app);
  require('./user.js')(app);
  require('./welcome.js')(app);
};
