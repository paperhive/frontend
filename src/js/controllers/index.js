module.exports = function (app) {
  require('./annotation.js')(app);
  require('./article.js')(app);
  require('./articleText.js')(app);
  require('./articleNew.js')(app);
  require('./discussion.js')(app);
  require('./navbar.js')(app);
  require('./navbar_user.js')(app);
  require('./notifications.js')(app);
  require('./oauthOrcid.js')(app);
  require('./settings.js')(app);
  require('./user.js')(app);
  require('./userArticles.js')(app);
  require('./welcome.js')(app);
};
