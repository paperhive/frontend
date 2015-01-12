module.exports = function (app) {
  require('./annotation.js')(app);
  require('./article.js')(app);
  require('./discussion.js')(app);
  require('./marginnote.js')(app);
  require('./oauthOrcid.js')(app);
  require('./user.js')(app);
  require('./welcome.js')(app);
};
